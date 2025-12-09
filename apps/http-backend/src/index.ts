import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '@repo/backend-common/config';
import { middleware } from "./middleware";
import { CreateUserSchema, SigninSchema, CreateRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {

    const data = CreateUserSchema.safeParse(req.body);
    if (!data.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    const { name, username, password } = data.data;
    try {
        const user = await prismaClient.user.create({
            data: {
                email: username,
                password: password,
                name: name
            }
        })
        res.json({
            userId: user.id
        })
    } catch (e) {
        console.log(e);
        res.json({
            message: "User already exists"
        })
        return;
    }
})

app.post("/signin", async (req, res) => {
    const data = SigninSchema.safeParse(req.body);
    if (!data.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }

    const { username, password } = data.data;
    const user = await prismaClient.user.findUnique({
        where: {
            email: username,
            password: password
        }
    })
    if (!user) {
        res.status(401).json({
            message: "Incorrect credentials"
        })
        return;
    }
    const userId = user.id;
    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        token
    })
})

app.post("/room", middleware, async (req, res) => {
    console.log("Inside room creation");
    const data = CreateRoomSchema.safeParse(req.body);
    if (!data.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    const userId = req.userId;
    console.log("userId", userId);
    if (!userId) {
        res.status(403).json({
            message: "Unauthorized"
        })
        return;
    }
    console.log("Creating room");
    try {
        const room = await prismaClient.room.create({
            data: {
                slug: data.data.name,
                adminId: userId
            }
        })
        console.log("Room created");
        res.json({
            roomId: room.id
        })
    } catch (e) {
        console.log(e);
        res.json({
            message: "Room already exists"
        })
        return;
    }
})

app.get("/chats/:roomId", middleware, async (req, res) => {
    try {
        const roomId = Number(req.params.roomId);
        console.log(req.params.roomId);
        const messages = await prismaClient.chat.findMany({
            where: {
                roomId: roomId
            },
            orderBy: {
                id: "desc"
            },
            take: 1000
        });

        res.json({
            messages
        })
    } catch (e) {
        console.log(e);
        res.json({
            messages: []
        })
    }

})

app.listen(3001);
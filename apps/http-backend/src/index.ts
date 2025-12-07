import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { CreateUserSchema, SignInUserSchema, RoomSchema } from "@repo/common/types";

const app = express();

app.post("/signup", (req, res) => {
    const data = CreateUserSchema.safeParse(req.body);
    if (!data.success) {
        return res.status(400).json({ message: data.error.message });
    }
    res.json({ message: "User signed up" });
})

app.post("/signin", (req, res) => {
    const data = SignInUserSchema.safeParse(req.body);
    if (!data.success) {
        return res.status(400).json({ message: data.error.message });
    }
    const { username, password } = data.data;
    const token = jwt.sign({ username }, JWT_SECRET);
    res.json({ token });
})


app.post("/room", middleware, (req, res) => {
    const data = RoomSchema.safeParse(req.body);
    if (!data.success) {
        return res.status(400).json({ message: data.error.message });
    }
    const { name } = data.data;
    res.json({ name });
})


app.listen(3000, () => {
    console.log("Server started on port 3000");
});

import { WebSocket, WebSocketServer } from "ws"
import { checkUser } from "./checkUser";
import { prismaClient } from "@repo/db/client"
import { createDrawQueue, createEraseQueue } from "@repo/backend-common";
import { createPubSubClients } from "@repo/backend-common";
import { UserManager } from "./managers/UserManager";

const wss = new WebSocketServer({ port: 8080 })

const drawQueue = createDrawQueue();
const eraseQueue = createEraseQueue();

const { publisher, subscriber } = createPubSubClients();

const userManager = new UserManager(publisher, subscriber);

wss.on("connection", function connection(ws, request) {

    console.log("Client connected trying")
    const url = request.url

    if (!url) {
        return;
    }
    console.log("url", url)

    const queryParams = new URLSearchParams(url.split("?")[1])
    const token = queryParams.get("token") || ""
    const userId = checkUser(token)
    console.log("userId", userId)

    if (userId === null) {
        ws.close()
        return null;
    }

    userManager.addUser(userId, ws)

    ws.on('error', console.error)

    ws.on('close', () => {
        userManager.removeUserConnection(ws)
    })

    ws.on('message', async function message(data) {
        let parsedData;

        if (typeof data !== "string") {
            parsedData = JSON.parse(data.toString())
        } else {
            parsedData = JSON.parse(data)
        }

        if (parsedData.type === "join_room") {
            userManager.joinRoom(ws, parsedData.roomId)
        }

        if (parsedData.type === "leave_room") {
            userManager.leaveRoom(ws, parsedData.roomId)
        }

        if (parsedData.type === "draw") {
            const roomId = parsedData.roomId
            const data = parsedData.data;

            drawQueue.add({
                roomId,
                data,
                userId
            })
            publisher.publish(roomId, JSON.stringify({
                type: "draw",
                roomId: roomId,
                data: data,
                senderId: userId
            }));
        }


        if (parsedData.type === "erase") {
            const roomId = parsedData.roomId
            const data = parsedData.data

            eraseQueue.add({
                roomId,
                data
            })

            // const wsConnections = userManager.getConnectionsInRoom(roomId)
            // wsConnections.forEach(connection => {
            //     if (connection !== ws && connection.readyState === WebSocket.OPEN) {
            //         connection.send(JSON.stringify({
            //             type: "erase",
            //             data,
            //             roomId
            //         }))
            //     }
            // })
            publisher.publish(roomId, JSON.stringify({
                type: "erase",
                roomId: roomId,
                data: data,
                senderId: userId
            }));
        }

    })
})
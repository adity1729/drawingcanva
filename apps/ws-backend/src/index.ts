import { WebSocket, WebSocketServer } from "ws"
import { checkUser } from "./checkUser";
import { createDrawQueue, createEraseQueue } from "@repo/backend-common";
import { createPubSubClients } from "@repo/backend-common";
import { UserManager } from "./managers/UserManager";

const wss = new WebSocketServer({ port: 8080 })

const drawQueue = createDrawQueue();
const eraseQueue = createEraseQueue();

const { publisher, subscriber } = createPubSubClients();

const userManager = new UserManager(publisher, subscriber);

function publishToRoom(roomId: string, type: "draw" | "erase", data: any, senderId: string) {
    publisher.publish(roomId, JSON.stringify({
        type,
        roomId,
        data,
        senderId
    }));
}

wss.on("connection", function connection(ws, request) {

    const url = request.url

    if (!url) {
        return;
    }

    const queryParams = new URLSearchParams(url.split("?")[1])
    const token = queryParams.get("token") || ""
    const userId = checkUser(token)

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
        try {
            parsedData = JSON.parse(data.toString());
        } catch (e) {
            return;
        }

        if (!parsedData.roomId) {
            return;
        }
        const roomId = String(parsedData.roomId);
        const { type, data: payload } = parsedData;

        switch (type) {
            case "join_room":
                userManager.joinRoom(ws, roomId);
                break;

            case "leave_room":
                userManager.leaveRoom(ws, roomId);
                break;

            case "draw":
                drawQueue.add({ roomId, data: payload, userId });
                publishToRoom(roomId, "draw", payload, userId);
                break;

            case "erase":
                eraseQueue.add({ roomId, data: payload });
                publishToRoom(roomId, "erase", payload, userId);
                break;

            default:
                console.warn("Unknown message type:", type);
        }
    });
})
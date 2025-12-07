import { WebSocketServer } from 'ws';
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '@repo/backend-common/config';

interface JwtPayload {
    userId: string;
    // Add other properties you encode in your JWT
    // iat?: number;  // issued at
    // exp?: number;  // expiration
}

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws, request) => {
    const url = request.url;
    if (!url) {
        ws.close();
        return;
    }
    const queryParm = new URLSearchParams(url.split("?")[1]);
    const token = queryParm.get("token");
    if (!token) {
        return;
    }
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (!decoded || !decoded.userId) {
        ws.close();
        return;
    }
    ws.on("message", (message) => {
        ws.send("pong");
    });
    ws.send("pong");
});

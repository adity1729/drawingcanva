import { WebSocket } from "ws";
import { Redis } from "ioredis";

interface UserMeta {
    userId: string;
    rooms: Set<string>;
    isAlive: boolean;
}

export class UserManager {
    // RoomID -> Set of WebSockets (for broadcasting to a room)
    private rooms: Map<string, Set<WebSocket>> = new Map();

    // WebSocket -> Metadata (The "Reverse Lookup" for O(1) cleanup)
    private socketMeta: Map<WebSocket, UserMeta> = new Map();

    constructor(private pub: Redis, private sub: Redis) {
        this.setupSubscriber();
    }

    private setupSubscriber() {
        this.sub.on("message", (channel, message) => {
            const parsedMessage = JSON.parse(message)
            if (parsedMessage.type === "draw") {
                this.broadcastToRoom(channel, parsedMessage.data, parsedMessage.senderId, "draw");
            }
            if (parsedMessage.type === "erase") {
                this.broadcastToRoom(channel, parsedMessage.data, parsedMessage.senderId, "erase");
            }
        })
    }

    private broadcastToRoom(roomId: string, data: any, senderId: string, type: "draw" | "erase") {
        const room = this.rooms.get(roomId);
        if (!room) {
            return;
        };

        room.forEach(connection => {
            const meta = this.socketMeta.get(connection);
            if (meta && connection.readyState === WebSocket.OPEN) {
                connection.send(JSON.stringify({
                    type,
                    data,
                    roomId
                }));
            }
        });
    }


    public addUser(userId: string, ws: WebSocket) {
        this.socketMeta.set(ws, {
            userId,
            rooms: new Set(),
            isAlive: true
        });
    }

    joinRoom(connection: WebSocket, roomId: string) {
        const meta = this.socketMeta.get(connection)
        if (!meta) {
            return;
        }
        meta.rooms.add(roomId);
        const room = this.rooms.get(roomId)
        if (!room || room.size === 0) {
            this.rooms.set(roomId, new Set([connection]))
            this.sub.subscribe(roomId)
        } else {
            room.add(connection)
        }
    }

    leaveRoom(connection: WebSocket, roomId: string) {
        const meta = this.socketMeta.get(connection)
        if (!meta) {
            return;
        }
        meta.rooms.delete(roomId);
        const room = this.rooms.get(roomId);
        if (room) {
            room.delete(connection);
            if (room.size === 0) {
                this.rooms.delete(roomId);
                this.sub.unsubscribe(roomId);
            }
        }
    }

    getConnectionsInRoom(roomId: string) {
        return this.rooms.get(roomId) || new Set();
    }

    removeUserConnection(connection: WebSocket) {
        const meta = this.socketMeta.get(connection)
        if (!meta) {
            return;
        }
        [...meta.rooms].forEach(roomId => this.leaveRoom(connection, roomId));
        this.socketMeta.delete(connection);
    }

}
import { WebSocket } from "ws";

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
        if (!room) {
            this.rooms.set(roomId, new Set([connection]))
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
        meta.isAlive = false;
        meta.rooms.forEach(
            roomId => {
                const room = this.rooms.get(roomId);
                room?.delete(connection);
                if (room?.size === 0) {
                    this.rooms.delete(roomId);
                }
            }
        )
        this.socketMeta.delete(connection);
    }

}
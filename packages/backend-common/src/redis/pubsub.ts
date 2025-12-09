import { createRedisClient } from '../queue/config';

// Redis Pub/Sub channels
export const CHANNELS = {
    DRAW: 'draw-channel',
    ERASE: 'erase-channel',
} as const;

export interface BroadcastMessage {
    type: 'draw' | 'erase';
    roomId: string;
    data: any;
    senderId: string;
}

// Helper to create pub/sub clients
export const createPubSubClients = () => ({
    publisher: createRedisClient(),
    subscriber: createRedisClient(),
});

// Helper to publish messages
export const publishMessage = async (
    publisher: ReturnType<typeof createRedisClient>,
    channel: string,
    message: BroadcastMessage
) => {
    await publisher.publish(channel, JSON.stringify(message));
};
import Redis from 'ioredis';
import { createRedisClient } from '../queue/config'; // Adjust path to where your config is

export const createPubSubClients = (): { publisher: Redis, subscriber: Redis } => {
    // 1. Create a dedicated connection for publishing messages
    const publisher = createRedisClient();

    // 2. Create a dedicated connection for subscribing to channels
    const subscriber = createRedisClient();

    // Optional: Log errors to ensure connections are healthy
    publisher.on('error', (err) => console.error('Redis Publisher Error:', err));
    subscriber.on('error', (err) => console.error('Redis Subscriber Error:', err));

    return {
        publisher,
        subscriber
    };
};
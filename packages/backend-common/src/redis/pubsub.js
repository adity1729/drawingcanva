"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPubSubClients = void 0;
const config_1 = require("../queue/config"); // Adjust path to where your config is
const createPubSubClients = () => {
    // 1. Create a dedicated connection for publishing messages
    const publisher = (0, config_1.createRedisClient)();
    // 2. Create a dedicated connection for subscribing to channels
    const subscriber = (0, config_1.createRedisClient)();
    // Optional: Log errors to ensure connections are healthy
    publisher.on('error', (err) => console.error('Redis Publisher Error:', err));
    subscriber.on('error', (err) => console.error('Redis Subscriber Error:', err));
    return {
        publisher,
        subscriber
    };
};
exports.createPubSubClients = createPubSubClients;

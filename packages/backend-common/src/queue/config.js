"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEraseQueue = exports.createDrawQueue = exports.QUEUE_NAMES = exports.createRedisClient = exports.redisConfig = void 0;
const bull_1 = __importDefault(require("bull"));
const ioredis_1 = __importDefault(require("ioredis"));
// Redis connection config
exports.redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    maxRetriesPerRequest: null, // Required for Bull
};
// Create Redis clients
const createRedisClient = () => new ioredis_1.default(exports.redisConfig);
exports.createRedisClient = createRedisClient;
// Queue names
exports.QUEUE_NAMES = {
    DRAW: 'draw-queue',
    ERASE: 'erase-queue',
};
// Create queues
const createDrawQueue = () => new bull_1.default(exports.QUEUE_NAMES.DRAW, {
    redis: exports.redisConfig,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
        removeOnComplete: true,
        removeOnFail: false,
    },
});
exports.createDrawQueue = createDrawQueue;
const createEraseQueue = () => new bull_1.default(exports.QUEUE_NAMES.ERASE, {
    redis: exports.redisConfig,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
        removeOnComplete: true,
        removeOnFail: false,
    },
});
exports.createEraseQueue = createEraseQueue;

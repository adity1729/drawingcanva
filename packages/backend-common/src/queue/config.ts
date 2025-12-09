import Queue from 'bull';
import Redis from 'ioredis';

// Redis connection config
export const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    maxRetriesPerRequest: null, // Required for Bull
};

// Create Redis clients
export const createRedisClient = () => new Redis(redisConfig);

// Queue names
export const QUEUE_NAMES = {
    DRAW: 'draw-queue',
    ERASE: 'erase-queue',
} as const;

// Job data types
export interface DrawJob {
    roomId: string;
    data: any;
    userId: string;
}

export interface EraseJob {
    roomId: string;
    data: any;
}

// Create queues
export const createDrawQueue = () => new Queue<DrawJob>(QUEUE_NAMES.DRAW, {
    redis: redisConfig,
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

export const createEraseQueue = () => new Queue<EraseJob>(QUEUE_NAMES.ERASE, {
    redis: redisConfig,
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
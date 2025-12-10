import Queue from 'bull';
import Redis from 'ioredis';
export declare const redisConfig: {
    host: string;
    port: number;
    maxRetriesPerRequest: null;
};
export declare const createRedisClient: () => Redis;
export declare const QUEUE_NAMES: {
    readonly DRAW: "draw-queue";
    readonly ERASE: "erase-queue";
};
export interface DrawJob {
    roomId: string;
    data: any;
    userId: string;
}
export interface EraseJob {
    roomId: string;
    data: any;
}
export declare const createDrawQueue: () => Queue.Queue<DrawJob>;
export declare const createEraseQueue: () => Queue.Queue<EraseJob>;
//# sourceMappingURL=config.d.ts.map
import { createDrawQueue, createEraseQueue, DrawJob, EraseJob } from '@repo/backend-common';
import { prismaClient } from '@repo/db/client';
import { Job } from 'bull';

const drawQueue = createDrawQueue();
const eraseQueue = createEraseQueue();

drawQueue.process(async (job: Job<DrawJob>) => {
    console.log("Processing draw job", job.data)
    const { roomId, data, userId } = job.data;

    try {
        await prismaClient.shape.create({
            data: {
                roomId: Number(roomId),
                data,
                userId,
            },
        });
        console.log(`✅ Draw completed for room ${roomId}`);
    } catch (error) {
        console.error(`❌ Draw failed:`, error);
        throw error;
    }
});

// Process erase jobs
eraseQueue.process(async (job: Job<EraseJob>) => {
    const { roomId, data } = job.data;

    try {
        await prismaClient.shape.deleteMany({
            where: { data, roomId: Number(roomId) },
        });
        console.log(`✅ Erase completed for room ${roomId}`);
    } catch (error) {
        console.error(`❌ Erase failed:`, error);
        throw error;
    }
});

// Error handlers
drawQueue.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed:`, err);
});

eraseQueue.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed:`, err);
});

console.log('🔧 Worker started and processing jobs...');

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('Shutting down worker...');
    await drawQueue.close();
    await eraseQueue.close();
    process.exit(0);
});
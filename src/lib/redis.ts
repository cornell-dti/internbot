import Redis from 'ioredis';

const REDIS_CONNECTION = process.env.REDIS_CONNECTION!;

export default REDIS_CONNECTION ? new Redis(REDIS_CONNECTION) : new Redis();

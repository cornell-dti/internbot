// rateLimiter.ts
import Redis from 'ioredis';
import type TRedis from 'ioredis';

export class RateLimiter {
	private redis: TRedis;
	private windowMs: number;
	private maxRequests: number;

	constructor(redis: TRedis, windowMs: number, maxRequests: number) {
		this.redis = redis;
		this.windowMs = windowMs;
		this.maxRequests = maxRequests;
	}

	async isAllowed(ip: string): Promise<boolean> {
		const key = `rate:${ip}`;
		const current = await this.redis.get(key);

		if (current !== null && parseInt(current) >= this.maxRequests) {
			return false;
		}

		await this.redis
			.multi()
			.incr(key)
			.expire(key, Math.ceil(this.windowMs / 1000))
			.exec();

		return true;
	}
}

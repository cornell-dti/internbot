import type { RequestHandler } from '@sveltejs/kit';
import Redis from 'ioredis';

const REDIS_CONNECTION = process.env.REDIS_CONNECTION!;
const redis = REDIS_CONNECTION ? new Redis(REDIS_CONNECTION) : new Redis();

export const GET: RequestHandler = async (req) => {
	// get whether bot_enabled
	const currentlyEnabled = (await redis.get('bot_enabled')) ?? 'false';
	return new Response(currentlyEnabled, {
		status: 200,
		headers: { 'Content-Type': 'text/plain' }
	});
};

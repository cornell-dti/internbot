import type { RequestHandler } from '@sveltejs/kit';
import Redis from 'ioredis';

const REDIS_CONNECTION = process.env.REDIS_CONNECTION!;
const redis = REDIS_CONNECTION ? new Redis(REDIS_CONNECTION) : new Redis();

export const POST: RequestHandler = async (req) => {
	try {
		await redis.set('bot_enabled', 'true');

		return new Response('Bot enabled.', { status: 200 });
	} catch (error) {
		console.error('Error enabling the bot:', error);
		return new Response('Error enabling the bot.', { status: 500 });
	}
};

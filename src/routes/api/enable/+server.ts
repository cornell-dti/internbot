import { Redis } from '@upstash/redis';
import type { RequestHandler } from '@sveltejs/kit';
import redis from '$lib/redis';

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN!;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN!;
const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL!;

export const POST: RequestHandler = async (req) => {
	try {
		await redis.set('bot_enabled', 'true');

		return new Response('Bot enabled.');
	} catch (error) {
		console.error('Error enabling the bot:', error);
		return new Response('Error enabling the bot.', { status: 500 });
	}
};

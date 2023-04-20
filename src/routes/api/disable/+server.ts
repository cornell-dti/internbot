import { Redis } from '@upstash/redis';
import type { RequestHandler } from '@sveltejs/kit';
import redis from '$lib/redis';

export const POST: RequestHandler = async (req) => {
	try {
		await redis.set('bot_enabled', 'false');

		return new Response('Bot disabled.');
	} catch (error) {
		console.error('Error disabling the bot:', error);
		return new Response('Error disabling the bot.', { status: 500 });
	}
};

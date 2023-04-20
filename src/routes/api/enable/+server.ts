import { Redis } from '@upstash/redis';
import type { RequestHandler } from '@sveltejs/kit';
import redis from '$lib/redis';

export const POST: RequestHandler = async (req) => {
	try {
		await redis.set('bot_enabled', 'true');

		return new Response('Bot enabled.');
	} catch (error) {
		console.error('Error enabling the bot:', error);
		return new Response('Error enabling the bot.', { status: 500 });
	}
};

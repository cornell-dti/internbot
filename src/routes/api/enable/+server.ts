import Redis from 'ioredis';
import type { RequestHandler } from '@sveltejs/kit';

const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

let client = new Redis(
	`redis://default:${UPSTASH_REDIS_REST_TOKEN}@us1-tender-mastodon-38225.upstash.io:38225`
);

export const POST: RequestHandler = async (req) => {
	try {
		await client.set('bot_enabled', 'true');

		return new Response('Bot enabled.');
	} catch (error) {
		console.error('Error enabling the bot:', error);
		return new Response('Error enabling the bot.', { status: 500 });
	}
};

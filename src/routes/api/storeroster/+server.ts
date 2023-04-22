import type { RequestHandler } from '@sveltejs/kit';
import Redis from 'ioredis';

const REDIS_CONNECTION = process.env.REDIS_CONNECTION!;
const redis = REDIS_CONNECTION ? new Redis(REDIS_CONNECTION) : new Redis();

export const POST: RequestHandler = async (req) => {
	const data = await req.request.json();
	const roster = data.roster as string[];
	await redis.set('roster', JSON.stringify(roster));
	return new Response('OK', {
		status: 200,
		headers: { 'Content-Type': 'text/plain' }
	});
};

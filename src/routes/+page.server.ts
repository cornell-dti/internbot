import Redis from 'ioredis';

const REDIS_CONNECTION = process.env.REDIS_CONNECTION!;

export async function load() {
	const redis = REDIS_CONNECTION ? new Redis(REDIS_CONNECTION) : new Redis();
	const currentlyEnabled = (await redis.get('bot_enabled')) ?? 'false';
	const currentRoster = JSON.parse((await redis.get('roster')) ?? '[]') as string[];
	return {
		currentlyEnabled: currentlyEnabled,
		currentRoster: currentRoster
	};
}

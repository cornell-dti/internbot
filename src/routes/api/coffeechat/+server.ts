import { WebClient } from '@slack/web-api';
import type { RequestHandler } from '@sveltejs/kit';
import redis from '$lib/redis';

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN!;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN!;
const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL!;

const slackClient = new WebClient(SLACK_BOT_TOKEN);

const shuffle = <T>(array: T[]): T[] => {
	let currentIndex = array.length,
		temporaryValue,
		randomIndex;
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
};

export const GET: RequestHandler = async (req) => {
	try {
		// Step 0: Check that the global enabled flag is true
		const isEnabled = await redis.get('bot_enabled');
		if (isEnabled !== 'true') {
			return new Response('Coffee Chats are not enabled', {
				status: 403,
				headers: { 'Content-Type': 'text/plain' }
			});
		}

		// 1. Perform updates to the database
		const { members } = await slackClient.conversations.members({ channel: 'CDXU35346' });
		await Promise.all(
			(members ?? []).map(async (member) => {
				const isInChannel = await redis.get(`user:${member}:in_channel`);
				if (isInChannel === null) {
					await redis.set(`user:${member}:in_channel`, 'true');
					await redis.set(`user:${member}:included`, 'true');
				} else if (isInChannel === 'false') {
					await redis.set(`user:${member}:in_channel`, 'true');
					await redis.set(`user:${member}:included`, 'true');
				}
			})
		);

		// 2. Perform random pairings
		const users = (await redis.keys('user:*:included'))
			.filter(async (key) => (await redis.get(key)) === 'true')
			.map((key) => key.split(':')[1]);

		const userPairs: [string, string][] = [];
		while (users.length > 1) {
			const shuffledUsers = shuffle<string>(users);
			const firstUser = shuffledUsers.pop()!;
			const secondUser = shuffledUsers.pop()!;

			const pairingHistory = await redis.smembers(`history:${firstUser}:${secondUser}`);
			if (pairingHistory.length === 0) {
				userPairs.push([firstUser, secondUser]);
				await redis.sadd(`history:${firstUser}:${secondUser}`, 'paired');
			} else {
				users.push(firstUser, secondUser);
			}
		}

		// 3. Send a group DM to every pair of users
		await Promise.all(
			userPairs.map(async ([user1, user2]) => {
				const { channel } = await slackClient.conversations.open({ users: `${user1},${user2}` });
				if (!channel || !channel.id)
					throw new Error('Could not open conversation with pair of users');
				await slackClient.chat.postMessage({
					channel: channel.id,
					text: `
					**HI! THIS IS A TEST MESSAGE!**

					**If something looks broken, DM <@U02KZ79CRD1>. We're working on an in-house replacement for Donut Bot! :robot_face:**

					**Specific things to let us know about: if the @s below don't work, the #coffee-chats channel isn't linked, or if the Slackmojis don't properly emojify.**
					
					Hello <@${user1}> and <@${user2}>!
					
					I'm your friendly :robot_face:, here to help you get to know your teammates by pairing everyone on a weekly basis! 

					Anyway, now that you're here, why don't you pick a time to meet for :coffee:, :tea:, :hamburger:, or :doughnut:s? Make sure you take quality, wholesome pictures to post in <#CDXU35346>!

					_Not interested? You can opt out of future pairings by leaving the <#CDXU35346> channel._`
				});
			})
		);

		return new Response('Pairings generated and sent', {
			status: 200,
			headers: { 'Content-Type': 'text/plain' }
		});
	} catch (error) {
		console.error('Error generating and sending pairings:', error);
		return new Response('Error generating and sending pairings', {
			status: 500,
			headers: { 'Content-Type': 'text/plain' }
		});
	}
};

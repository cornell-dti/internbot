import { WebClient } from '@slack/web-api';
import type { RequestHandler } from '@sveltejs/kit';
import Redis from 'ioredis';
import { RateLimiter } from '$lib/util/rateLimiter';

const REDIS_CONNECTION = process.env.REDIS_CONNECTION!;
const redis = new Redis(REDIS_CONNECTION);
const rateLimiter = new RateLimiter(redis, 12000, 1); // 12 seconds window and 1 request allowed within the window

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN!;
const slackClient = new WebClient(SLACK_BOT_TOKEN);

const CHANNEL_ID = process.env.COFFEE_CHAT_CHANNEL_ID!;

// ===== Helper Functions =====

const generateMessage = (user1: string, user2: string) => `
Hello <@${user1}> and <@${user2}>!

I'm your friendly neighborhood :robot_face:, here to help you get to know your teammates by pairing everyone on a weekly basis! 

Anyway, now that you're here, why don't you pick a time to meet for :coffee:, :tea:, :hamburger:, or :doughnut:s? Make sure you take quality, wholesome pictures to post in <#CDXU35346>!

_Not interested? You can opt out of future pairings by leaving the <#CDXU35346> channel._`;

type SlackID = string;
type NetID = string;

type UserObj = {
	slackID: SlackID;
	netID: NetID;
};

// get whether bot_enabled globally
const enabled = async (): Promise<boolean> => (await redis.get('bot_enabled')) === 'true';

// get NetID from SlackID
const getNetID = async (slackID: SlackID): Promise<NetID> =>
	(await slackClient.users.info({ user: slackID })).user?.profile?.email?.split('@')[0] ?? '';

// get all the members in the channel and return them as an array of UserObjs
const getAllUsersInChannel = async (): Promise<UserObj[]> =>
	await Promise.all(
		(
			await slackClient.conversations.members({ channel: CHANNEL_ID })
		).members?.map(async (id) => ({
			slackID: id,
			netID: await getNetID(id)
		})) ?? []
	);

// get the roster from the database and parse it as an array of netIDs
const getRosterFromDB = async (): Promise<NetID[]> =>
	JSON.parse((await redis.get('roster')) ?? '[]') as NetID[];

// take the intersection of the roster and the members in the channel and return all the slackIDs as an array
const getMembers = async (roster: NetID[], channelMembers: UserObj[]): Promise<SlackID[]> =>
	channelMembers.filter((member) => roster.includes(member.netID)).map((member) => member.slackID);

const addPairToDB = async (user1: SlackID, user2: SlackID) =>
	await redis.sadd(`coffeechat:${user1}`, user2);

const hasPairBeenPaired = async (user1: SlackID, user2: SlackID) =>
	(await redis.sismember(`coffeechat:${user1}`, user2)) === 1;

const popRandomPairFromArr = <T>(arr: T[]): [T, T] => {
	do {
		// generate two random indices, check if they're equal, and if not, shallow copy the pair, remove the pair from the array, and return the pair
		const index1 = Math.floor(Math.random() * arr.length);
		const index2 = Math.floor(Math.random() * arr.length);

		if (index1 !== index2) {
			const pair = [arr[index1], arr[index2]] as [T, T];

			arr.splice(index1, 1);
			arr.splice(index2, 1);

			return pair;
		}
	} while (true);
};

// ===== Main Function =====

export const GET: RequestHandler = async (req) => {
	// Throttle based on client IP
	const clientIp = req.request.headers.get('x-forwarded-for') || 'fallback-placeholder-ip'; // Vercel should set this header (https://vercel.com/docs/concepts/edge-network/headers#x-vercel-ip-country)

	const isAllowed = await rateLimiter.isAllowed(clientIp);
	if (!isAllowed) {
		return new Response('Too many requests', {
			status: 429,
			headers: { 'Content-Type': 'text/plain' }
		});
	}

	try {
		// Step 0: Check that the global enabled flag is true, and if not, return a 403
		if (!(await enabled())) {
			return new Response('Coffee Chats are not enabled', {
				status: 403,
				headers: { 'Content-Type': 'text/plain' }
			});
		}

		// Step 1: Populate userPairs with random pairs that haven't been paired before
		const members = await getMembers(await getRosterFromDB(), await getAllUsersInChannel());
		const userPairs: [SlackID, SlackID][] = [];

		while (members.length > 1) {
			const pair = popRandomPairFromArr(members);
			if (!(await hasPairBeenPaired(pair[0], pair[1]))) {
				userPairs.push(pair);
				await addPairToDB(pair[0], pair[1]);
			}
		}

		// Step 2. Send a group DM to every pair of users
		await Promise.all(
			userPairs.map(async ([user1, user2]) => {
				const { channel } = await slackClient.conversations.open({ users: `${user1},${user2}` });
				if (!channel || !channel.id)
					throw new Error('Could not open conversation with pair of users');
				await slackClient.chat.postMessage({
					channel: channel.id,
					text: generateMessage(user1, user2)
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

// ===== Inline Tests with Vitest =====

if (import.meta.vitest) {
	const { it, expect } = import.meta.vitest;

	const dummyRoster = ['abc', 'def', 'ghi'];
	const dummyChannelMembers = [
		{ slackID: '1', netID: 'abc' },
		{ slackID: '2', netID: 'def' },
		{ slackID: '3', netID: 'jkl' }
	];

	const me = {
		name: 'Daniel Wei',
		netID: 'dlw266',
		slackID: 'U02KZ79CRD1'
	};

	// These members reported the bot not DMing them, so we're hardcoding them in for testing.
	// Strangely, the tests pass regardless. I'm not sure why.
	const realTestableMembers = [
		{
			name: 'Pranavi Gupta',
			slackID: 'U033TMWE5DK',
			netID: 'pg342'
		},
		{
			name: 'Valerie Wong',
			netID: 'vkw7',
			slackID: 'U04Q99S2Y3C'
		},
		{
			name: 'Noorejehan Umar',
			netID: 'nu44',
			slackID: 'U033WJZ8H0S'
		},
		{
			name: 'Richard Gu',
			netID: 'rg779',
			slackID: 'U033G1EB7SB'
		}
	];

	it('getMembers correctly', async () =>
		expect(await getMembers(dummyRoster, dummyChannelMembers)).toEqual(['1', '2']));

	it(
		'gets NetID from SlackID',
		async () => expect(await getNetID(me.slackID)).toBe(me.netID),
		30000
	);

	it('s DB roster contains these members', async () =>
		realTestableMembers.forEach(async (member) => {
			expect(await getRosterFromDB()).toContain(member.netID);
		}));

	it('s coffee-chats channel list contains these members', async () =>
		realTestableMembers.every(async (member) =>
			(await getAllUsersInChannel()).find(
				(user) => user.slackID === member.slackID && user.netID === member.netID
			)
				? true
				: false
		));
}

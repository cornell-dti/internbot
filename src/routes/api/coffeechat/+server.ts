import { WebClient } from '@slack/web-api';
import type { RequestHandler } from '@sveltejs/kit';
import Redis from 'ioredis';

const REDIS_CONNECTION = process.env.REDIS_CONNECTION!;
const redis = REDIS_CONNECTION ? new Redis(REDIS_CONNECTION) : new Redis();

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN!;
const slackClient = new WebClient(SLACK_BOT_TOKEN);

// ===== Arbitrary Constants =====

const CHANNEL_ID = 'CDXU35346';

const generateMessage = (user1: string, user2: string) => `
Hello <@${user1}> and <@${user2}>!

I'm your friendly neighborhood :robot_face:, here to help you get to know your teammates by pairing everyone on a weekly basis! 

Anyway, now that you're here, why don't you pick a time to meet for :coffee:, :tea:, :hamburger:, or :doughnut:s? Make sure you take quality, wholesome pictures to post in <#CDXU35346>!

_Not interested? You can opt out of future pairings by leaving the <#CDXU35346> channel._`;

// ===== Helper Functions =====

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
const getMembers = async (): Promise<SlackID[]> =>
	(await getAllUsersInChannel())
		.filter(async (member) => (await getRosterFromDB()).includes(member.netID))
		.map((member) => member.slackID);

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
	try {
		// Step 0: Check that the global enabled flag is true, and if not, return a 403
		if (!(await enabled())) {
			return new Response('Coffee Chats are not enabled', {
				status: 403,
				headers: { 'Content-Type': 'text/plain' }
			});
		}

		// Step 1: Populate userPairs with random pairs that haven't been paired before
		const members = await getMembers();
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

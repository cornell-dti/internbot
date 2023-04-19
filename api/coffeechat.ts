import { type VercelRequest, type VercelResponse } from '@vercel/node';
import { WebClient } from '@slack/web-api';

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const webClient = new WebClient(SLACK_BOT_TOKEN);

const getAllUsers = async (): Promise<string[]> => {
	const result = await webClient.users.list();
	const users = (result.members ?? [])
		.filter((member) => !member.is_bot && !member.deleted)
		.map((member) => member.id);

	return users.map((user) => user ?? '');
};

const createGroupDMs = async (userPairs: [string, string][]) => {
	for (const pair of userPairs) {
		const result = await webClient.conversations.open({
			users: pair.join(',')
		});

		if (result && result.channel && result.channel.id) {
			await webClient.chat.postMessage({
				channel: result.channel.id,
				text: 'HI!'
			});
		}
	}
};

export default async (req: VercelRequest, res: VercelResponse) => {
	try {
		const users = await getAllUsers();
		const userPairs: [string, string][] = [];

		for (let i = 0; i < users.length - 1; i += 2) {
			userPairs.push([users[i], users[i + 1]]);
		}

		await createGroupDMs(userPairs);

		res.status(200).send('Weekly DMs sent.');
	} catch (error) {
		console.error('Error sending DMs:', error);
		res.status(500).send('Error sending DMs');
	}
};

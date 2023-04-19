import { VercelRequest, VercelResponse } from '@vercel/node';
import { WebClient } from '@slack/web-api';

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const webClient = new WebClient(SLACK_BOT_TOKEN);

const getUserByName = async (name: string): Promise<string | undefined> => {
	const result = await webClient.users.list();

	for (const member of result.members ?? []) {
		if (member.real_name === name || member.name === name) {
			return member.id;
		}
	}

	return undefined;
};

const sendMessageToUser = async (userId: string, message: string) => {
	const result = await webClient.conversations.open({
		users: userId
	});

	if (result && result.channel && result.channel.id) {
		await webClient.chat.postMessage({
			channel: result.channel.id,
			text: message
		});
	}
};

export default async (req: VercelRequest, res: VercelResponse) => {
	try {
		const userId = await getUserByName('Daniel Wei');

		if (userId) {
			await sendMessageToUser(userId, 'Alive and Healthy!');
			res.status(200).send('Health check message sent.');
		} else {
			res.status(404).send('User not found.');
		}
	} catch (error) {
		console.error('Error sending health check message:', error);
		res.status(500).send('Error sending health check message');
	}
};

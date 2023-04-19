import type { RequestHandler } from '@sveltejs/kit';
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

export const GET: RequestHandler = async (req) => {
	try {
		const userId = await getUserByName('Daniel Wei');

		if (userId) {
			await sendMessageToUser(userId, 'Alive and Healthy!');
			// return a 200 response
			return new Response('Health check message sent.');
		} else {
			// return a 404 response
			return new Response('User not found', { status: 404 });
		}
	} catch (error) {
		console.error('Error sending health check message:', error);
		// return a 500 response
		return new Response('Error sending health check message', { status: 500 });
	}
};

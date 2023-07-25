import { WebClient } from "@slack/web-api";

const slackToken = process.env.SLACK_BOT_TOKEN; // won't work outside of nextjs

const slackClient = new WebClient(slackToken);

export default slackClient;

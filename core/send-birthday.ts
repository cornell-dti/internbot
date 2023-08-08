import slackClient from "../lib/clients/slack";
import prisma from "../lib/clients/prisma";
import { oDefIn } from "../lib/utils";
import { generateAttachment, generateMessage } from "@/lib/data/birthday";

const birthdayChannelID = oDefIn(process.env.BIRTHDAY_CHANNEL_ID);

/**
 * This function sends a DM to the Birthday Channel tagging the user!
 */
const sendMessage = async (user: string) =>
    await slackClient.chat.postMessage({
        channel: birthdayChannelID,
        text: generateMessage(user),
        attachments: [generateAttachment()],
    });

/**
 * This function runs every day, and checks if there are any birthdays today.
 * If there are, it'll send an individual HBD message to the channel that
 * tags each birthday person.
 */
export const sendBirthdayMessages = async () => {
    const server = await prisma.server.findFirst({ where: { enabled: true } });

    // If the bot is disabled, do nothing.

    if (!server || !server.enabled) {
        console.log("Bot is disabled.");
        return;
    }

    // Otherwise, send birthday messages!

    const today = new Date();

    const birthdayKids = (
        await prisma.user.findMany({
            where: {
                NOT: {
                    birthday: null,
                },
            },
        })
    ).filter((user) =>
        user.birthday
            ? user.birthday.getMonth() === today.getMonth() &&
              user.birthday.getDate() === today.getDate()
            : false
    );

    await Promise.all(birthdayKids.map((user) => sendMessage(user.id)));
};

export const exec = async () => {
    console.log("Sending birthday messages...");
    await sendBirthdayMessages();
    console.log("Done!");
};

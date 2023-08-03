import slackClient from "../lib/clients/slack";
import prisma from "../lib/clients/prisma";
import { listToSet, oDefIn, pairList } from "../lib/utils";
import { User } from "@prisma/client";

const coffeeChatChannelId = oDefIn(process.env.COFFEE_CHAT_CHANNEL_ID);

/**
 * This function fetches all the users in a given Slack channel.
 */
const fetchChannelMemberIDs = async (channelId: string) => {
    const response = await slackClient.conversations.members({
        channel: channelId,
    });
    return response.members as string[];
};

/**
 * Gets the current (aka. latest, most recent) semester.
 * @returns The current semester.
 */
const getCurrentSemester = async () => {
    const semesters = await prisma.semester.findMany({
        orderBy: { endDate: "desc" },
        take: 1,
    });

    return semesters[0];
};

/**
 * This function fetches all active users in the current and last semester.
 * It also includes the semester data for each user.
 */
const fetchActiveUsers = async () => {
    const semesters = await prisma.semester.findMany({
        orderBy: { endDate: "desc" },
        take: 2,
        include: {
            semesterToUsers: {
                where: { active: true },
                include: { user: true },
            },
        },
    });

    const users = listToSet(
        semesters
            .map((sem) => sem.semesterToUsers)
            .flat()
            .map((semToU) => semToU.user)
            .flat(),
        (a, b) => a.id === b.id
    );

    return users;
};

/**
 * This function checks whether two users have been paired in the past two semesters.
 */
const haveBeenPaired = async (user1Id: string, user2Id: string) => {
    const pastPairings = await prisma.pair.findMany({
        where: {
            OR: [
                { user1Id, user2Id },
                { user1Id: user2Id, user2Id: user1Id },
            ],
        },
        orderBy: { id: "desc" },
        take: 2,
    });

    return pastPairings.length > 0;
};

/**
 * This function sends a DM to the users with the coffee chat message.
 */
const sendDM = async (user1: string, user2: string) => {
    const message = generateMessage(user1, user2);
    const { channel } = await slackClient.conversations.open({
        users: `${user1},${user2}`,
    });
    if (!channel || !channel.id)
        throw new Error("Could not open conversation with pair of users");
    await slackClient.chat.postMessage({
        channel: channel.id,
        text: message,
    });
};

export const generateMessage = (user1: string, user2: string) => `
Hello <@${user1}> and <@${user2}>!

I'm your friendly neighborhood :robot_face:, here to help you get to know your teammates by pairing everyone on a weekly basis! 

Anyway, now that you're here, why don't you pick a time to meet for :coffee:, :tea:, :hamburger:, or :doughnut:s? Make sure you take quality, wholesome pictures to post in <#CDXU35346>!

_Not interested? You can opt out of future pairings by leaving the <#${coffeeChatChannelId}> channel._`;

/**
 * This function does the main work of pairing up the users for coffee chats.
 */
export const sendCoffeeChats = async () => {
    const server = await prisma.server.findFirst({ where: { enabled: true } });

    // If the bot is disabled, do nothing

    if (!server || !server.enabled) {
        console.log("Bot is disabled.");
        return;
    }

    // Fetch the IDs of all users that are both active in the last two semesters and currently in the coffee chat channel

    const channelMemberIDs = await fetchChannelMemberIDs(coffeeChatChannelId);

    const activeUsers = await fetchActiveUsers();

    let eligibleUsers = activeUsers.filter(
        (user) => channelMemberIDs.indexOf(user.id) !== -1
    );

    // Pair the users randomly

    const pairings = await pairList<(typeof eligibleUsers)[number]>(
        eligibleUsers,
        (a, b) => a.id === b.id,
        async (a, b) => !(await haveBeenPaired(a.id, b.id)),
        true
    );

    // For each pairing, send a DM to the users and save to DB

    for (const pairing of pairings) {
        await sendDM(pairing[0].id, pairing[1].id);
        await prisma.pair.create({
            data: {
                user1Id: pairing[0].id,
                user2Id: pairing[1].id,
                semesterId: (await getCurrentSemester()).id,
            },
        });
    }
};

export const exec = async () => {
    console.log("Sending coffee chats...");
    await sendCoffeeChats();
    console.log("Done!");
};

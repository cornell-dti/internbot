import slackClient from "../lib/clients/slack";
import prisma from "../lib/clients/prisma";
import { oDefIn } from "../lib/utils";

const coffeeChatChannelId = oDefIn(process.env.COFFEE_CHAT_CHANNEL_ID);

/**
 * This function fetches all the users in a given Slack channel.
 */
const fetchChannelMembers = async (channelId: string) => {
    const response = await slackClient.conversations.members({
        channel: channelId,
    });
    return response.members as string[];
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

    const activeUsers = semesters.flatMap((s) =>
        s.semesterToUsers.map((stu) => ({ ...stu.user, semester: s }))
    );
    return activeUsers;
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
    await slackClient.chat.postMessage({ channel: user1, text: message });
    await slackClient.chat.postMessage({ channel: user2, text: message });
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

    if (!server) {
        console.log("Bot is disabled.");
        return;
    }

    const channelMembers = await fetchChannelMembers(coffeeChatChannelId);
    const activeUsers = await fetchActiveUsers();

    const eligibleUsers = activeUsers.filter((user) =>
        channelMembers.includes(user.id)
    );

    while (eligibleUsers.length > 1) {
        let user1 = oDefIn(eligibleUsers.pop());
        let user2Index = 0;

        // Find a user who hasn't been paired with user1 in the past two semesters.
        while (
            user2Index < eligibleUsers.length &&
            (await haveBeenPaired(user1.id, eligibleUsers[user2Index].id))
        ) {
            user2Index++;
        }

        if (user2Index === eligibleUsers.length) {
            console.log(`No eligible pair found for user ${user1.id}`);
            continue;
        }

        let user2 = eligibleUsers.splice(user2Index, 1)[0];

        await prisma.pair.create({
            data: {
                user1Id: user1.id,
                user2Id: user2.id,
                semesterId: user1.semester.id,
            },
        });

        await sendDM(user1.id, user2.id);
    }
};

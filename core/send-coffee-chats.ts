import { WebClient } from "@slack/web-api";
import prisma from "../lib/prisma";

const slackToken = process.env.SLACK_BOT_TOKEN;
const slackClient = new WebClient(slackToken);

/**
 * Message to send to the users.
 */
const generateMessage = (user1: string, user2: string) => `
Hello <@${user1}> and <@${user2}>!

I'm your friendly neighborhood :robot_face:, here to help you get to know your teammates by pairing everyone on a weekly basis! 

Anyway, now that you're here, why don't you pick a time to meet for :coffee:, :tea:, :hamburger:, or :doughnut:s? Make sure you take quality, wholesome pictures to post in <#CDXU35346>!

_Not interested? You can opt out of future pairings by leaving the <#CDXU35346> channel._`;

/**
 * Function to fetch all active users in the current semester.
 */
const fetchActiveUsers = async (semesterId: number) => {
    return prisma.semesterToUser.findMany({
        where: {
            semesterId: semesterId,
            active: true,
        },
    });
};

/**
 * Function to check if two users have been paired in last two semesters.
 */
const checkIfPaired = async (
    user1Id: string,
    user2Id: string,
    semesterId: number
) => {
    const previousTwoSemesters = await prisma.semester.findMany({
        where: {
            id: {
                lt: semesterId,
            },
        },
        orderBy: {
            id: "desc",
        },
        take: 2,
    });

    if (previousTwoSemesters.length === 0) {
        return false;
    }

    const pairs = await prisma.pair.findMany({
        where: {
            OR: [
                {
                    user1Id: user1Id,
                    user2Id: user2Id,
                },
                {
                    user1Id: user2Id,
                    user2Id: user1Id,
                },
            ],
            semesterId: {
                in: previousTwoSemesters.map((semester) => semester.id),
            },
        },
    });

    return pairs.length > 0;
};

/**
 * Main function to pair users and send them a message.
 */
const sendCoffeeChats = async () => {
    // Fetch current semester based on current date.
    const currentSemester = await prisma.semester.findFirst({
        where: {
            startDate: {
                lte: new Date(),
            },
            endDate: {
                gte: new Date(),
            },
        },
    });

    if (!currentSemester) {
        console.error("No current semester found.");
        return;
    }

    // Fetch all active users.
    const activeUsers = await fetchActiveUsers(currentSemester.id);

    // Shuffle active users to ensure randomness.
    const shuffledUsers = activeUsers.sort(() => Math.random() - 0.5);

    // Iterate over the active users and pair them up.
    for (let i = 0; i < shuffledUsers.length; i += 2) {
        const user1 = shuffledUsers[i];
        const user2 = shuffledUsers[i + 1];

        // If there's an odd number of users, the last one won't have a pair.
        if (!user2) {
            console.log(`User ${user1.userId} did not get a pair this time.`);
            continue;
        }

        // Check if they've been paired in last two semesters.
        const hasBeenPaired = await checkIfPaired(
            user1.userId,
            user2.userId,
            currentSemester.id
        );

        if (hasBeenPaired) {
            console.log(
                `Users ${user1.userId} and ${user2.userId} have been paired in last two semesters.`
            );
            continue;
        }

        // Create a pair.
        await prisma.pair.create({
            data: {
                user1Id: user1.userId,
                user2Id: user2.userId,
                semesterId: currentSemester.id,
            },
        });

        // Send them a DM.
        const message = generateMessage(user1.userId, user2.userId);
        await slackClient.conversations.open({
            users: `${user1.userId},${user2.userId}`,
            return_im: true,
        });
        await slackClient.chat.postMessage({
            channel: `${user1.userId},${user2.userId}`,
            text: message,
        });
    }
};

// Execute!
// sendCoffeeChats().catch(console.error);

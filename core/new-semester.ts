import prisma from "../lib/clients/prisma";
import { differenceInMonths, startOfMonth, endOfMonth } from "date-fns";
import { fLetDefIn } from "../lib/utils";
import slackClient from "../lib/clients/slack";

/**
 * This function initializes the database for a new semester:
 * 1. It adds/updates all the users in the Slack server to our database, based on Slack server.
 * 2. It adds/updates an existing server entry in our database, based on Slack team ID.
 *
 */
export const populate = async () => {
    const teamResponse = await slackClient.team.info();

    const currentMonth = new Date();

    // Retrieve the users of the team and add them to our database.
    const usersResponse = await slackClient.users.list();

    // prettier-ignore
    // Add each user in the Slack server to our database.
    const users = await Promise.all(
        fLetDefIn(usersResponse.members, (members) =>
            members.map((member) =>
                fLetDefIn(member.id, (memID) =>
                fLetDefIn(member.name, (memName) =>
                fLetDefIn(member.profile?.email, (memEmail) => // TODO: make it resilient to if people don't have emails
                fLetDefIn(teamResponse.team?.id, (resID) =>
                    prisma.user.upsert({
                        where: { id: memID },
                        update: {},
                        create: {
                            name: memName,
                            email: memEmail,
                            id: memID,
                            server: { connect: { id: parseInt(resID) } },
                            birthday: null,
                        },
                    })
                ))))
            )
        )
    );

    // prettier-ignore
    // Create or update a server entry identified by the Slack team ID.
    const server = 
        await fLetDefIn(teamResponse.team?.id, async (teamID) =>
        await fLetDefIn(teamResponse.team?.id, async (teamName) =>
            await prisma.server.upsert({
                where: { id: parseInt(teamID) },
                update: {
                    name: teamName,
                    users: {
                        connect: users.map((user) => ({ id: user.id })),
                    },
                },
                create: {
                    id: parseInt(teamID),
                    name: teamName,
                    users: {
                        connect: users.map((user) => ({ id: user.id })),
                    },
                },
            })
        )
    );

    // Check if it's the start of a new semester
    const breakpoint = 8; // August!
    if (
        currentMonth.getMonth() === 0 ||
        currentMonth.getMonth() === breakpoint
    ) {
        const semester = await prisma.semester.create({
            data: {
                name: `Semester ${
                    currentMonth.getMonth() < breakpoint ? "Spring" : "Fall"
                } ${currentMonth.getFullYear()}`,
                startDate: startOfMonth(currentMonth),
                endDate: endOfMonth(
                    currentMonth.setMonth(currentMonth.getMonth() + 5)
                ),
            },
        });

        // Add users to the new semester
        const semesterToUser = await Promise.all(
            users.map((user) =>
                prisma.semesterToUser.create({
                    data: {
                        userId: user.id,
                        semesterId: semester.id,
                        active: true,
                    },
                })
            )
        );
    }
};

export const exec = async () => {
    await populate();
    await prisma.$disconnect();
};

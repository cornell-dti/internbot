import prisma from "../lib/clients/prisma";
import { differenceInMonths, startOfMonth, endOfMonth } from "date-fns";
import { fLetDefIn, fLetIn, stringToNumber } from "../lib/utils";
import slackClient from "../lib/clients/slack";

/**
 * This function initializes the database for a new semester:
 * 1. It adds/updates all the users in the Slack server to our database, based on Slack server.
 * 2. It adds/updates an existing server entry in our database, based on Slack team ID.
 *
 */
export const populate = async () => {
    const currentMonth = new Date();

    const teamResponse = await slackClient.team.info();
    const teamID = stringToNumber(teamResponse.team?.id);
    const teamName = teamResponse.team?.name || "Default";

    // Create/update server
    await prisma.server.upsert({
        where: { id: teamID },
        update: { name: teamName },
        create: { id: teamID, name: teamName },
    });

    // Create/update users
    const usersResponse = await slackClient.users.list();
    const humans =
        usersResponse.members?.filter(
            (member) => !member.is_bot && !member.deleted
        ) || [];

    // prettier-ignore
    for (const human of humans) {
        if (!human.id || !human.name) continue;

        prisma.user.upsert({
            where: { id: human.id },
            update: {},
            create: {
                name: human.name,
                email: human.profile?.email,
                id: human.id,
                server: { 
                    connect: { 
                        id: teamID
                    } 
                },
                birthday: null,
            },
        })
    }

    // Create/update semester
    const breakpoint = 6;
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
    for (const human of humans) {
        if (!human.id) continue;
        prisma.semesterToUser.create({
            data: {
                userId: human.id,
                semesterId: semester.id,
                active: true,
            },
        });
    }
};

export const exec = async () => {
    console.log("Initializing new semester...");
    await populate();
    console.log("Done!");
};

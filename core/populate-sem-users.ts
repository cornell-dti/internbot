import prisma from "../lib/clients/prisma";
import { differenceInMonths, startOfMonth, endOfMonth } from "date-fns";
import { fLetDefIn } from "../lib/utils";
import slackClient from "../lib/clients/slack";

export const populate = async () => {
    const teamResponse = await slackClient.team.info();

    const currentMonth = new Date();

    // Retrieve the users of the team and add them to our database.
    const usersResponse = await slackClient.users.list();

    // prettier-ignore
    // Add each user to our database.
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

    // Create or update a server entry
    const server = await fLetDefIn(
        teamResponse.team?.id,
        async (teamID) =>
            await fLetDefIn(
                teamResponse.team?.id,
                async (teamName) =>
                    await prisma.server.upsert({
                        where: { id: parseInt(teamID) },
                        update: {},
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
    if (currentMonth.getMonth() === 0 || currentMonth.getMonth() === 6) {
        const semester = await prisma.semester.create({
            data: {
                name: `Semester ${
                    currentMonth.getMonth() === 0 ? "Spring" : "Fall"
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

// Execute!
populate()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });

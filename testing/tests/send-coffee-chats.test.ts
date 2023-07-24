import { sendCoffeeChats, generateMessage } from "../../core/send-coffee-chats";
import { prismaMock } from "../mock-clients/prisma";
import { slackMock } from "../mock-clients/slack";
import {
    mockPairings,
    mockSemesters,
    mockServer,
    mockUsers,
} from "../mock-data/data";

// Testing when the bot is enabled
test("sendCoffeeChats creates pairings and sends DMs when the bot is enabled", async () => {
    // Mock the return values from the Prisma and Slack client methods
    prismaMock.server.findFirst.mockResolvedValue(mockServer);
    prismaMock.semester.findMany.mockResolvedValue(mockSemesters);
    prismaMock.pair.findMany.mockResolvedValue(mockPairings);
    prismaMock.pair.create.mockResolvedValue({
        id: 1,
        user1Id: "U023BECGF",
        user2Id: "W012A3CDE",
        semesterId: 1,
    });
    slackMock.conversations.members.mockResolvedValue({
        ok: true,
        members: [mockUsers[0].id, mockUsers[1].id, mockUsers[2].id],
    });
    slackMock.chat.postMessage.mockResolvedValue({ ok: true });

    // Call the sendCoffeeChats function
    await sendCoffeeChats();

    // Verify the Prisma and Slack client methods were called correctly
    expect(prismaMock.server.findFirst).toBeCalledWith({
        where: { enabled: true },
    });
    expect(prismaMock.semester.findMany).toBeCalledWith({
        orderBy: { endDate: "desc" },
        take: 2,
        include: {
            semesterToUsers: {
                where: { active: true },
                include: { user: true },
            },
        },
    });
    expect(prismaMock.pair.create).toBeCalledTimes(1); // As there are 3 active users, only one pairing is created
    expect(slackMock.conversations.members).toBeCalledWith({
        channel: process.env.COFFEE_CHAT_CHANNEL_ID,
    });
    expect(slackMock.chat.postMessage).toBeCalledTimes(2); // Messages should be sent to both the users in the pair
    expect(slackMock.chat.postMessage).toBeCalledWith({
        channel: expect.any(String),
        text: generateMessage(expect.any(String), expect.any(String)),
    });
});

// Testing when the bot is disabled
test("sendCoffeeChats does nothing when the bot is disabled", async () => {
    prismaMock.server.findFirst.mockResolvedValue({
        ...mockServer,
        enabled: false,
    });
    await sendCoffeeChats();
    expect(prismaMock.semester.findMany).not.toBeCalled(); // When the bot is disabled, no other methods should be called
});

// Test the edge cases...

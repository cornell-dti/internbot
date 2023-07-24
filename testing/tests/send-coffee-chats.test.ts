import { sendCoffeeChats, generateMessage } from "../../core/send-coffee-chats";
import { prismaMock } from "../mock-clients/prisma";
import { slackMock } from "../mock-clients/slack";
import { mockServers } from "../mock-data/data";

// Testing when the bot is enabled
test("sendCoffeeChats creates pairings and sends DMs when the bot is enabled", async () => {
    // Choose to mock with the enabled server
    prismaMock.server.findFirst.mockResolvedValue(mockServers.enabled);

    // Call the sendCoffeeChats function
    await sendCoffeeChats();

    // Verify the Prisma and Slack client methods were called correctly...

    // ...Specifically, check how many pairs were created: with 7 eligible users
    expect(prismaMock.pair.create).toBeCalledTimes(3);
    expect(slackMock.conversations.members).toBeCalledWith({
        channel: process.env.COFFEE_CHAT_CHANNEL_ID,
    });

    // ...Resulting in 3 Group DMs being created.
    expect(slackMock.chat.postMessage).toBeCalledTimes(3); // Messages should be sent to both the users in the pair
    expect(slackMock.chat.postMessage).toBeCalledWith({
        channel: expect.any(String),
        text: expect.any(String),
    });
});

// Testing when the bot is disabled
test("sendCoffeeChats does nothing when the bot is disabled", async () => {
    // Choose to mock with the disabled server
    prismaMock.server.findFirst.mockResolvedValue(mockServers.disabled);
    // Call the sendCoffeeChats function
    await sendCoffeeChats();
    // Verify the Prisma and Slack client methods were called correctly
    expect(prismaMock.semester.findMany).not.toBeCalled(); // When the bot is disabled, no other methods should be called
});

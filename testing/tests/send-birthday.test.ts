import { sendBirthdayMessages } from "@/core/send-birthday";
import { prismaMock } from "../mock-clients/prisma";
import { slackMock } from "../mock-clients/slack";
import { mockUsers, mockServers } from "../mock-data/data";

// Testing when the bot is enabled
test("sendBirthdayMessages sends birthday messages when the bot is enabled", async () => {
    // Choose to mock with the enabled server
    prismaMock.server.findFirst.mockResolvedValue(mockServers.enabled);

    // Call the sendBirthdayMessages function
    await sendBirthdayMessages();

    // Verify the Prisma and Slack client methods were called correctly...
    expect(prismaMock.user.findMany).toBeCalledTimes(1);
    expect(slackMock.chat.postMessage).toBeCalledTimes(2); // Messages should be sent to users whose birthdays were set to the current time.
    expect(slackMock.chat.postMessage).toBeCalledWith({
        channel: expect.any(String),
        text: expect.any(String),
    });
});

// Testing when the bot is disabled
test("sendBirthdayMessages does nothing when the bot is disabled", async () => {
    // Choose to mock with the disabled server
    prismaMock.server.findFirst.mockResolvedValue(mockServers.disabled);
    // Call the sendBirthdayMessages function
    await sendBirthdayMessages();
    // Verify the Prisma and Slack client methods were called correctly
    expect(prismaMock.user.findMany).not.toBeCalled();
    expect(slackMock.chat.postMessage).not.toBeCalled();
});

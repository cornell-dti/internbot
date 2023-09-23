import { populate } from "@/core/new-semester";
import { prismaMock } from "../mock-clients/prisma";
import { slackMock } from "../mock-clients/slack";
import { mockUsers, mockServers } from "../mock-data/data";

// Testing when the bot is enabled
test("Creates a New Semester", async () => {
    // Choose to mock with the enabled server
    prismaMock.server.findFirst.mockResolvedValue(mockServers.enabled);

    // Call the function
    await populate();

    // Check that the server was updated
    expect(prismaMock.server.upsert).toBeCalledTimes(1);

    // Check that the users were updated
    expect(prismaMock.user.upsert).toBeCalledTimes(mockUsers.length);

    // Check that the semester was created
    expect(prismaMock.semester.create).toBeCalledTimes(1);

    // Check that users were added to the semester
    expect(prismaMock.semesterToUser.create).toBeCalledTimes(mockUsers.length);
});

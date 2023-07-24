// slack.ts
import { WebClient } from "@slack/web-api";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";

import slack from "../../lib/clients/slack";
import { mockUsers } from "../mock-data/data";

// Define mock response
const mockMembers = mockUsers.map((u) => u.id);
const mockResponse = {
    ok: true,
    members: mockMembers,
};

jest.mock("../../lib/clients/slack", () => ({
    __esModule: true,
    default: mockDeep<WebClient>(),
}));

beforeEach(() => {
    mockReset(slackMock);
    // Mock the return value
    slackMock.conversations.members.mockResolvedValue(mockResponse);
});

export const slackMock = slack as unknown as DeepMockProxy<WebClient>;

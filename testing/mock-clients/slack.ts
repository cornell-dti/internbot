// slack.ts
import { WebClient } from "@slack/web-api";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";

import slack from "../../lib/clients/slack";
import { mockUsers, mockUsersInChannel } from "../mock-data/data";

jest.mock("../../lib/clients/slack", () => ({
    __esModule: true,
    default: mockDeep<WebClient>(),
}));

beforeEach(() => {
    mockReset(slackMock);
    initMocks(slackMock);
});

const initMocks = (slackMock: DeepMockProxy<WebClient>) => {
    slackMock.conversations.members.mockResolvedValue({
        ok: true,
        members: mockUsersInChannel,
    });
    slackMock.chat.postMessage.mockResolvedValue({ ok: true });
};

export const slackMock = slack as unknown as DeepMockProxy<WebClient>;

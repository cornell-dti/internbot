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
    slackMock.conversations.open.mockResolvedValue({
        ok: true,
        channel: { id: process.env.COFFEE_CHAT_CHANNEL_ID },
    });

    slackMock.users.list.mockResolvedValue({
        ok: true,
        members: mockUsers.map((u) => ({
            ...u,
            is_bot: false,
            deleted: false,
        })),
    });
    slackMock.team.info.mockResolvedValue({
        ok: true,
        team: {
            id: "0",
            name: "Example Name",
        },
    });
};

export const slackMock = slack as unknown as DeepMockProxy<WebClient>;

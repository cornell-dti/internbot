import { Pair, PrismaClient, PrismaPromise } from "@prisma/client";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";
import prisma from "../../lib/clients/prisma";
import {
    mockPairings,
    mockUsers,
    mockServers,
    mockSemesters,
} from "../mock-data/data";

jest.mock("../../lib/clients/prisma", () => ({
    __esModule: true,
    default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
    mockReset(prismaMock);
    initMocks(prismaMock);
});

const initMocks = (prismaMock: DeepMockProxy<PrismaClient>) => {
    // Mock: resolve instantly to get all semesters.
    prismaMock.semester.findMany.mockResolvedValue(mockSemesters);
    // Mock: implementation of the findMany method to filter pairings.
    prismaMock.pair.findMany.mockImplementation(
        (params): PrismaPromise<Pair[]> => {
            const { user1Id, user2Id } = params?.where?.OR![0] as unknown as {
                user1Id: string;
                user2Id: string;
            };

            // Filter pairings based on the user1Id and user2Id passed in
            const result = mockPairings.filter(
                (pair) =>
                    (pair.user1Id === user1Id && pair.user2Id === user2Id) ||
                    (pair.user1Id === user2Id && pair.user2Id === user1Id)
            );

            // Return a Promise resolving to the result.
            return Promise.resolve(result) as PrismaPromise<Pair[]>;
        }
    );
    // Mock: resolve instantly to get the enabled semester.
    prismaMock.server.findFirst.mockResolvedValue(mockServers.enabled);
    // Mock: resolve instantly to create a new pairing (doesn't matter what the values are).
    prismaMock.pair.create.mockResolvedValue({
        id: 1,
        user1Id: "N/A 1",
        user2Id: "N/A 2",
        semesterId: 1,
    });
};

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

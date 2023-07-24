// prisma.ts
import { Pair, PrismaClient, PrismaPromise } from "@prisma/client";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";

import prisma from "../../lib/clients/prisma";
import { mockPairings, mockUsers } from "../mock-data/data";

// Define mock response
const mockSemesters = [
    {
        id: 1,
        name: "Semester 1",
        startDate: new Date("2021-01-01"),
        endDate: new Date("2021-06-30"),
        semesterToUsers: [
            {
                active: true,
                user: {
                    id: mockUsers[0].id,
                    name: mockUsers[0].name,
                    // you may also need to include other user properties here
                },
            },
            {
                active: true,
                user: {
                    id: mockUsers[1].id,
                    name: mockUsers[1].name,
                    // you may also need to include other user properties here
                },
            },
        ],
    },
    {
        id: 2,
        name: "Semester 2",
        startDate: new Date("2021-07-01"),
        endDate: new Date("2021-12-31"),
        semesterToUsers: [
            {
                active: true,
                user: {
                    id: mockUsers[2].id,
                    name: mockUsers[2].name,
                    // you may also need to include other user properties here
                },
            },
        ],
    },
];

jest.mock("../../lib/clients/prisma", () => ({
    __esModule: true,
    default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
    mockReset(prismaMock);
    // Mock the return value
    prismaMock.semester.findMany.mockResolvedValue(mockSemesters);
    // Mock the findMany method of the Prisma pairings client
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
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

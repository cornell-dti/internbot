// Mock data for the Prisma and Slack clients

// prettier-ignore
export const mockUsers = [
    { id: "U01", name: "User1", email: "u01@gmail.com", birthday: new Date("2002-11-06") },
    { id: "U02", name: "User2", email: "u02@gmail.com", birthday: new Date("2002-08-07") },
    { id: "U03", name: "User3", email: "u03@gmail.com", birthday: new Date("2002-10-10") },
    { id: "U04", name: "User4", email: "u04@gmail.com", birthday: new Date("2002-12-12") },
    { id: "U05", name: "User5", email: "u05@gmail.com", birthday: new Date("2002-01-01") },
    { id: "U06", name: "User6", email: "u06@gmail.com", birthday: new Date("2003-02-02") },
    { id: "U07", name: "User7", email: "u06@gmail.com", birthday: new Date() },
    { id: "U08", name: "User8", email: "u06@gmail.com", birthday: new Date("2003-04-04") },
    { id: "U09", name: "User9", email: "u06@gmail.com", birthday: new Date("2003-05-05") },
    { id: "U10", name: "User10", email: "u10@gmail.com", birthday: new Date() },
];

export const mockServers = {
    enabled: { id: 1, name: "Server1", enabled: true },
    disabled: { id: 2, name: "Server2", enabled: false },
};

export const mockPairings = [
    {
        id: 1,
        user1Id: mockUsers[0].id,
        user2Id: mockUsers[1].id,
        semesterId: 1,
    },
    {
        id: 2,
        user1Id: mockUsers[3].id,
        user2Id: mockUsers[4].id,
        semesterId: 2,
    },
];

/**
 * Map each user to whether they're in the coffee chat channel.
 */
const inChannel: {
    [userId: string]: boolean;
} = {
    U01: true,
    U02: true,
    U03: true,
    U04: true,
    U05: true,
    U06: true,
    U07: true,
    U08: true,
    U09: true,
    U10: false,
};

export const mockUsersInChannel = mockUsers
    .filter((u) => inChannel[u.id])
    .map((u) => u.id);

/**
 * Map each user to an array of the semesters they were/are active in.
 */
const activity: {
    [semId: number]: string[]; // map semester IDs to user IDs that were active in that semester
} = {
    1: ["U01", "U02"],
    2: ["U02", "U03", "U04", "U05"],
    3: ["U01", "U02", "U03", "U04", "U05", "U08", "U09", "U10"],
};

export const mockSemesterToUsers = (semesterId: number) =>
    activity[semesterId].map((userId) => ({
        id: [userId, semesterId],
        userId,
        user: mockUsers.find((u) => u.id === userId)!,
        semesterId,
        active: true,
    }));

export const mockSemesters = [
    {
        id: 1,
        semesterToUsers: mockSemesterToUsers(1),
        name: "Semester 1",
        startDate: new Date("2021-01-01"),
        endDate: new Date("2021-06-30"),
    },
    {
        id: 2,
        semesterToUsers: mockSemesterToUsers(2),
        name: "Semester 2",
        startDate: new Date("2021-07-01"),
        endDate: new Date("2021-12-31"),
    },
    {
        id: 3,
        semesterToUsers: mockSemesterToUsers(3),
        name: "Semester 3",
        startDate: new Date("2022-01-01"),
        endDate: new Date("2022-06-30"),
    },
];

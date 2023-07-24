// Mock data for the Prisma and Slack clients
export const mockUsers = [
    { id: "U01", name: "User1", semester: { id: 1 } },
    { id: "U02", name: "User2", semester: { id: 1 } },
    { id: "U03", name: "User3", semester: { id: 2 } },
];
export const mockServer = { id: 1, name: "Server1", enabled: true };
export const mockPairings = [
    {
        id: 1,
        user1Id: mockUsers[0].id,
        user2Id: mockUsers[1].id,
        semesterId: mockUsers[0].semester.id,
    },
    {
        id: 2,
        user1Id: mockUsers[1].id,
        user2Id: mockUsers[2].id,
        semesterId: mockUsers[1].semester.id,
    },
];
export const mockSemesters = [
    {
        id: 1,
        semesterToUsers: [mockUsers[0], mockUsers[1]],
        name: "Semester 1",
        startDate: new Date("2021-01-01"),
        endDate: new Date("2021-06-30"),
    },
    {
        id: 2,
        semesterToUsers: [mockUsers[2]],
        name: "Semester 2",
        startDate: new Date("2021-07-01"),
        endDate: new Date("2021-12-31"),
    },
];

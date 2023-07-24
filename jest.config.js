module.exports = {
    clearMocks: true,
    preset: "ts-jest",
    testEnvironment: "node",
    setupFiles: ["<rootDir>/testing/mock-env/setup.ts"],
    setupFilesAfterEnv: [
        "<rootDir>/testing/mock-clients/prisma.ts",
        "<rootDir>/testing/mock-clients/slack.ts",
    ],
};

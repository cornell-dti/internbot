const nextJest = require("next/jest");

const createJestConfig = nextJest({
    dir: "./",
});

/** @type {import('jest').Config} */
const customJestConfig = {
    moduleDirectories: ["node_modules", "<rootDir>/"],
    testEnvironment: "jest-environment-jsdom",
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    clearMocks: true,
    preset: "ts-jest",
    setupFiles: ["<rootDir>/testing/mock-env/setup.ts"],
    setupFilesAfterEnv: [
        "<rootDir>/testing/mock-clients/prisma.ts",
        "<rootDir>/testing/mock-clients/slack.ts",
    ],
};

module.exports = createJestConfig(customJestConfig);

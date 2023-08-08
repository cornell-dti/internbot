import prisma from "../lib/clients/prisma";

// Function to get the bot status for a specific server
export const getBotStatus = async (serverId: number): Promise<boolean> => {
    const server = await prisma.server.findUnique({
        where: { id: serverId },
    });

    if (!server) throw new Error("Server not found.");

    return server.enabled;
};

// Function to get the bot status for the current server
export const getCurrentBotStatus = async (): Promise<boolean> => {
    const server = await prisma.server.findFirst({});

    if (!server) throw new Error("Server not found.");

    return server.enabled;
};

// Function to toggle the bot status for a given server
export const toggleBotStatus = async (serverId: number): Promise<boolean> => {
    const server = await prisma.server.findUnique({
        where: { id: serverId },
    });

    if (!server) throw new Error("Server not found.");

    const updatedServer = await prisma.server.update({
        where: { id: serverId },
        data: { enabled: !server.enabled },
    });

    return updatedServer.enabled;
};

// Function to toggle the bot status for the current server
export const toggleCurrentBotStatus = async (): Promise<boolean> => {
    const server = await prisma.server.findFirst({});

    if (!server) throw new Error("Server not found.");

    const updatedServer = await prisma.server.update({
        where: { id: server.id },
        data: { enabled: !server.enabled },
    });

    return updatedServer.enabled;
};

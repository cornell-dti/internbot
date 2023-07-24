import prisma from "../lib/prisma";

// Function to get the bot status for a given server
export async function getBotStatus(serverId: number): Promise<boolean> {
    const server = await prisma.server.findUnique({
        where: { id: serverId },
    });

    if (!server) throw new Error("Server not found.");

    return server.enabled;
}

// Function to toggle the bot status for a given server
export async function toggleBotStatus(serverId: number): Promise<boolean> {
    const server = await prisma.server.findUnique({
        where: { id: serverId },
    });

    if (!server) throw new Error("Server not found.");

    const updatedServer = await prisma.server.update({
        where: { id: serverId },
        data: { enabled: !server.enabled },
    });

    return updatedServer.enabled;
}

import { getCurrentBotStatus } from "@/core/bot-status";

const readBotStatus = async () => {
    try {
        const res = await getCurrentBotStatus();
        return res ? "Bot is enabled" : "Bot is disabled";
    } catch (e) {
        return "No server configured yet.";
    }
};

const BotStatus = async () => {
    const status = await readBotStatus();

    return (
        <div>
            <h1>Bot Status:</h1>
            <p>{status}</p>
        </div>
    );
};

export default BotStatus;

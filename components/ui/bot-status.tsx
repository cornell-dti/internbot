import { getCurrentBotStatus } from "@/core/bot-status";

const readBotStatus = async () => {
    try {
        const res = await getCurrentBotStatus();
        return res ? "Enabled" : "Disabled";
    } catch (e) {
        return "No server configured yet.";
    }
};

const BotStatus = async () => {
    const status = await readBotStatus();

    if (status === "Enabled") {
        return (
            <div className='border-2 border-green-400 bg-green-200 rounded-md p-2'>
                <span className='text-green-600'>
                    Bot is currently <b>{status}</b>
                </span>
            </div>
        );
    }

    return (
        <div className='border-2 bg-gray-200 rounded-md p-2'>
            <span className='text-gray-400'>
                Bot is currently <b>{status}</b>
            </span>
        </div>
    );
};

export default BotStatus;

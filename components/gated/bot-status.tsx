import { toggleCurrentBotStatus } from "@/core/bot-status";

// Server action defined inside a Server Component
const ToggleBotStatus = () => {
    const toggle = async () => {
        "use server";
        await toggleCurrentBotStatus();
    };

    return (
        <form action={toggle}>
            <button type='submit'>Toggle Bot Enabled/Disabled</button>
        </form>
    );
};

export default ToggleBotStatus;

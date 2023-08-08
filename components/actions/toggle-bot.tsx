import { toggleCurrentBotStatus } from "@/core/bot-status";
import { Power } from "lucide-react";
import Help from "@/components/ui/help";

const ToggleBot = () => {
    const toggleBot = async () => {
        "use server";
        await toggleCurrentBotStatus();
    };

    return (
        <form className='flex flex-row gap-4' action={toggleBot}>
            <button
                type='submit'
                className='bg-rose-600 hover:bg-gray-800 transition-all text-white font-semibold h-12 w-12 rounded-full'
            >
                <Power className='inline-block -mt-1' />
            </button>
            <Help text='Enable/Disable the Bot' />
        </form>
    );
};

export default ToggleBot;

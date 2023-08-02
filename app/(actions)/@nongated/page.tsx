import BotStatus from "@/components/bot-status";
import { Suspense } from "react";
import { exec as execNewSem } from "@/core/new-semester";
import Help from "@/components/help";

const NonGatedActions = () => {
    const action = async () => {
        "use server";
        await execNewSem();
    };

    return (
        <div className='w-full flex flex-col gap-4'>
            <Suspense fallback={<div>Fetching Bot Status...</div>}>
                {/* @ts-expect-error Async Server Component */}
                <BotStatus />
            </Suspense>

            <form action={action} className='flex flex-row gap-4'>
                <button
                    type='submit'
                    className='bg-gray-600 hover:bg-gray-800 transition-all text-white font-semibold py-2 px-4 rounded'
                >
                    Initiate New Semester
                </button>
                <Help
                    text='Populate the database with the latest data from Slack,
                    and create a new semester based on the current time.'
                />
            </form>
        </div>
    );
};

export default NonGatedActions;

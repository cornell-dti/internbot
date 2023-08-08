import BotStatus from "@/components/bot-status";
import { Suspense } from "react";

const NonGatedActions = () => {
    return (
        <div className='w-full flex flex-col gap-4'>
            <Suspense fallback={<div>Fetching Bot Status...</div>}>
                {/* @ts-expect-error Async Server Component */}
                <BotStatus />
            </Suspense>
        </div>
    );
};

export default NonGatedActions;

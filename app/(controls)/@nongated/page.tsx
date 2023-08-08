import SetMyBday from "@/components/actions/set-my-bday";
import BotStatus from "@/components/ui/bot-status";
import { Suspense } from "react";

const NonGatedActions = () => {
    return (
        <div className='w-full flex flex-col gap-4'>
            <Suspense fallback={<div>Fetching Bot Status...</div>}>
                {/* @ts-expect-error Async Server Component */}
                <BotStatus />
            </Suspense>
            <SetMyBday />
        </div>
    );
};

export default NonGatedActions;

import BotStatus from "@/components/bot-status";
import { Suspense } from "react";
import { exec as execNewSem } from "@/core/new-semester";

const NonGatedActions = () => {
    const action = async () => {
        "use server";
        console.log("Populating new semester...");
        await execNewSem();
    };

    return (
        <div>
            <h1>Non-Gated Actions</h1>

            <Suspense fallback={<div>Fetching Bot Status...</div>}>
                {/* @ts-expect-error Async Server Component */}
                <BotStatus />
            </Suspense>

            <form action={action}>
                <button type='submit'>Populate Database</button>
            </form>
        </div>
    );
};

export default NonGatedActions;

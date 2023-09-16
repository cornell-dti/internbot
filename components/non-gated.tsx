import { Suspense } from "react";
import BotStatus from "./non-gated/bot-status";
import PopulateNewSemester from "./non-gated/new-semester";

const NonGatedComponents = () => {
    return (
        <>
            <Suspense fallback={<div>Fetching Bot Status...</div>}>
                {/* @ts-expect-error Async Server Component */}
                <BotStatus />
            </Suspense>
            <PopulateNewSemester />
        </>
    );
};

export default NonGatedComponents;

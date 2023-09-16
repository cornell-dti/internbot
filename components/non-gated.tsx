import { Suspense } from "react";
import PopulateNewSemester from "./non-gated/new-semester";
import BotStatus from "@/components/ui/bot-status";

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

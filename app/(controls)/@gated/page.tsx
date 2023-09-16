import { currentUser } from "@clerk/nextjs";
import Help from "@/components/ui/help";
import ToggleBot from "@/components/actions/toggle-bot";
import InitSem from "@/components/actions/init-sem";
import ManualTriggers from "@/components/actions/manual-triggers";
import SetSomeonesBday from "@/components/actions/set-someones-bday";
import admins from "@/lib/data/admins";

const GatedActions = async () => {
    const hasAccess = await getHasDashboardAccess();

    if (!hasAccess) {
        return (
            <div className='flex flex-row gap-4 my-2'>
                <span className='text-gray-400 border-gray-200 p-2 border-2 rounded-lg'>
                    Some actions are hidden.
                </span>
                <Help text='You do not have admin access.' />
            </div>
        );
    }

    return (
        <div className='flex flex-col gap-4 h-full w-full'>
            <ToggleBot />
            <InitSem />
            <ManualTriggers />
            <SetSomeonesBday />
        </div>
    );
};

const getHasDashboardAccess = async () => {
    const checkIfUserHasAccess = async (email: string) =>
        admins.some((admin) => admin.email === email);

    const emails = (await currentUser())?.emailAddresses;

    if (!emails) {
        return false;
    }

    for (const email of emails) {
        const hasAccess = await checkIfUserHasAccess(email.emailAddress);
        if (hasAccess) {
            return true;
        }
    }

    return false;
};

export default GatedActions;

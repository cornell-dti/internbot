import { currentUser } from "@clerk/nextjs";
import prisma from "../../../lib/clients/prisma";
import { addUserOrUpdateBirthday } from "@/core/add-birthday";
import { exec as execCoffeeChats } from "@/core/send-coffee-chats";
import { toggleCurrentBotStatus } from "@/core/bot-status";
import { Power } from "lucide-react";
import Help from "@/components/help";

const getHasDashboardAccess = async () => {
    const checkIfUserHasAccess = async (email: string) =>
        (await prisma.user.findFirst({
            where: {
                email: email,
            },
        }))
            ? true
            : false;

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

const GatedActions = async () => {
    const hasAccess = await getHasDashboardAccess();

    if (!hasAccess) {
        return (
            <div className='flex flex-row gap-4 my-2'>
                <span className='text-gray-400 border-gray-200 p-2 border-2 rounded-lg'>
                    Some actions are hidden.
                </span>
                <Help text='You do not have admin access. Your email was not found in the Cornell Slack database.' />
            </div>
        );
    }

    const addBirthday = async (formdata: FormData) => {
        "use server";

        const email = formdata.get("email") as string | null;
        const date = formdata.get("date") as string | null; // format: YYYY-MM-DD

        if (!email || !date) {
            return;
        }

        await addUserOrUpdateBirthday(email, new Date(date));
    };

    const sendCoffeeChats = async () => {
        "use server";
        await execCoffeeChats();
    };

    const toggleBot = async () => {
        "use server";
        await toggleCurrentBotStatus();
    };

    return (
        <div>
            <form className='flex flex-col gap-4 w-full'>
                <div className='flex flex-row gap-4'>
                    <button
                        formAction={toggleBot}
                        className='bg-gray-600 hover:bg-gray-800 transition-all text-white font-semibold p-2 w-24 rounded-full'
                    >
                        <Power className='inline-block' />
                    </button>
                    <Help text='Enable/Disable the Bot' />
                </div>
                <div className='flex flex-row gap-4'>
                    <button
                        formAction={sendCoffeeChats}
                        className='bg-gray-600 hover:bg-gray-800 transition-all text-white font-semibold py-2 px-4 w-fit rounded'
                    >
                        Send Coffee Chats
                    </button>
                    <Help text='Manually send out a round of coffee chats!' />
                </div>
            </form>
            {/* <form action={addBirthday}>
                <input type='email' name='email' />
                <input type='date' name='date' />
                <button type='submit'>Submit New Birthday</button>
            </form> */}
        </div>
    );
};

export default GatedActions;

import { currentUser } from "@clerk/nextjs";
import prisma from "../../../lib/clients/prisma";
import { addUserOrUpdateBirthday } from "@/core/add-birthday";
import { exec as execCoffeeChats } from "@/core/send-coffee-chats";
import { exec as execNewSem } from "@/core/new-semester";
import { exec as execBirthdays } from "@/core/send-birthday";
import { toggleCurrentBotStatus } from "@/core/bot-status";
import { Power } from "lucide-react";
import Help from "@/components/help";

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
        const date = formdata.get("date") as string | null;

        if (!email || !date) {
            return;
        }

        await addUserOrUpdateBirthday(email, new Date(date));
    };

    const sendCoffeeChats = async () => {
        "use server";
        await execCoffeeChats();
    };

    const sendBirthdayMessages = async () => {
        "use server";
        await execBirthdays();
    };

    const toggleBot = async () => {
        "use server";
        await toggleCurrentBotStatus();
    };

    const initNewSem = async () => {
        "use server";
        await execNewSem();
    };

    return (
        <div className='flex flex-col gap-4 h-full w-full'>
            <form className='flex flex-col gap-4 w-full'>
                <div className='flex flex-row gap-4'>
                    <button
                        formAction={toggleBot}
                        className='bg-rose-600 hover:bg-gray-800 transition-all text-white font-semibold h-12 w-12 rounded-full'
                    >
                        <Power className='inline-block -mt-1' />
                    </button>
                    <Help text='Enable/Disable the Bot' />
                </div>
                <div className='flex flex-row gap-4'>
                    <button
                        formAction={initNewSem}
                        className='border-2 border-red-600 text-red-600 bg-white hover:bg-gray-200 transition-all font-semibold py-2 px-4 rounded'
                    >
                        Initiate New Semester
                    </button>
                    <Help
                        text='Populate the database with the latest data from Slack,
                    and create a new semester based on the current time.'
                    />
                </div>
                <div className='flex flex-row gap-4'>
                    <button
                        formAction={sendBirthdayMessages}
                        className='bg-gray-600 hover:bg-gray-800 transition-all text-white font-semibold py-2 px-4 w-fit rounded'
                    >
                        Send Birthday Messages
                    </button>
                    <Help text='Manually send out birthday messages for the day!' />
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
            <form
                action={addBirthday}
                className='border-2 border-gray-200 rounded-lg flex flex-col gap-2 p-4 w-full'
            >
                <input
                    type='email'
                    name='email'
                    placeholder='Member Email'
                    className='bg-gray-100 rounded-md p-2'
                />
                <input
                    type='date'
                    name='date'
                    className='bg-gray-100 rounded-md p-2'
                />
                <button
                    type='submit'
                    className='bg-gray-200 hover:bg-gray-400 transition-all font-semibold p-2 px-3 w-fit rounded'
                >
                    Change Member&apos;s Birthday
                </button>
            </form>
        </div>
    );
};

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

export default GatedActions;

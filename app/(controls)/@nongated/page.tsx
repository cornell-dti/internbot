import BotStatus from "@/components/bot-status";
import { Suspense } from "react";
import { addUserOrUpdateBirthday } from "@/core/add-birthday";
import { auth } from "@clerk/nextjs";

const NonGatedActions = () => {
    const addBirthday = async (formdata: FormData) => {
        "use server";

        const email = auth().user?.emailAddresses.find((email) =>
            email.emailAddress.includes("cornell.edu")
        );

        const date = formdata.get("date") as string | null;

        if (!email || !date) {
            return;
        }

        await addUserOrUpdateBirthday(email.emailAddress, new Date(date));
    };

    return (
        <div className='w-full flex flex-col gap-4'>
            <Suspense fallback={<div>Fetching Bot Status...</div>}>
                {/* @ts-expect-error Async Server Component */}
                <BotStatus />
            </Suspense>

            <form
                action={addBirthday}
                className='border-2 border-gray-200 rounded-lg flex flex-col gap-2 p-4 w-full'
            >
                <input
                    type='date'
                    name='date'
                    className='bg-gray-100 rounded-md p-2'
                />
                <button
                    type='submit'
                    className='bg-gray-200 hover:bg-gray-400 transition-all font-semibold p-2 px-3 w-fit rounded'
                >
                    Set My Birthday
                </button>
            </form>
        </div>
    );
};

export default NonGatedActions;

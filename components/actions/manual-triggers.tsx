import Help from "@/components/ui/help";

import { exec as execCoffeeChats } from "@/core/send-coffee-chats";
import { exec as execBirthdays } from "@/core/send-birthday";
import LabelDivider from "../ui/label-divider";

const ManualTriggers = () => {
    const sendCoffeeChats = async () => {
        "use server";
        await execCoffeeChats();
    };

    const sendBirthdayMessages = async () => {
        "use server";
        await execBirthdays();
    };

    return (
        <div>
            <LabelDivider text='Manual Triggers' />
            <form className='flex flex-row gap-4 w-full'>
                <div className='flex flex-row gap-4'>
                    <button
                        formAction={sendBirthdayMessages}
                        className='bg-gray-600 hover:bg-gray-800 transition-all text-white font-semibold py-2 px-4 w-fit rounded'
                    >
                        Birthday Wishes
                    </button>
                </div>
                <div className='flex flex-row gap-4'>
                    <button
                        formAction={sendCoffeeChats}
                        className='bg-gray-600 hover:bg-gray-800 transition-all text-white font-semibold py-2 px-4 w-fit rounded'
                    >
                        Coffee Chats
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ManualTriggers;

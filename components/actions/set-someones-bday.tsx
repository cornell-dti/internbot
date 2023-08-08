import { addUserOrUpdateBirthday } from "@/core/add-birthday";
import LabelDivider from "../ui/label-divider";

const SetSomeonesBday = () => {
    const addBirthday = async (formdata: FormData) => {
        "use server";

        const email = formdata.get("email") as string | null;
        const date = formdata.get("date") as string | null;

        if (!email || !date) {
            console.log("Invalid inputs");
            return;
        }

        console.log("Adding birthday...");
        await addUserOrUpdateBirthday(email, new Date(date));
    };

    return (
        <div>
            <LabelDivider text='Edit My Birthday' />
            <form action={addBirthday} className='flex flex-col gap-2'>
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

export default SetSomeonesBday;

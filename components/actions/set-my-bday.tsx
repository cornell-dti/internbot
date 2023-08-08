import { addUserOrUpdateBirthday } from "@/core/add-birthday";
import { currentUser } from "@clerk/nextjs";
import LabelDivider from "../ui/label-divider";

const SetMyBday = () => {
    const addBirthday = async (formdata: FormData) => {
        "use server";

        const user = await currentUser();
        if (!user) {
            throw new Error("You must be signed in!");
        }

        const email = user.emailAddresses.find((email) =>
            email.emailAddress.includes("cornell.edu")
        );
        const date = formdata.get("date") as string | null;

        if (!email || !date) {
            console.log("Invalid inputs", email, date);
            return;
        }

        console.log("Adding birthday...");
        await addUserOrUpdateBirthday(email.emailAddress, new Date(date));
    };

    return (
        <div>
            <LabelDivider text='Edit My Birthday' />
            <form action={addBirthday} className='flex flex-col gap-2'>
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

export default SetMyBday;

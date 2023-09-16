import { addUserOrUpdateBirthday } from "@/core/add-birthday";

const AddBirthday = () => {
    const action = async (formdata: FormData) => {
        "use server";

        const email = formdata.get("email") as string | null;
        const date = formdata.get("date") as string | null; // format: YYYY-MM-DD

        if (!email || !date) {
            return;
        }

        await addUserOrUpdateBirthday(email, new Date(date));
    };

    return (
        <form action={action}>
            <input type='email' name='email' required />
            <input type='date' name='date' required />
            <button type='submit'>Submit New Birthday</button>
        </form>
    );
};

export default AddBirthday;

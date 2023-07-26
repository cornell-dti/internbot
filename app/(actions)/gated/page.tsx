import { currentUser } from "@clerk/nextjs";
import prisma from "../../../lib/clients/prisma";
import { addUserOrUpdateBirthday } from "@/core/add-birthday";
import { exec as execCoffeeChats } from "@/core/send-coffee-chats";
import { toggleCurrentBotStatus } from "@/core/bot-status";

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
        return <div>Access denied to Dashboard.</div>;
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
            <h1>Gated Actions</h1>

            <form action={addBirthday}>
                <button formAction={toggleBot}>
                    Toggle Bot Enabled/Disabled
                </button>
                <button formAction={sendCoffeeChats}>
                    Manually send a round of coffee chats
                </button>
                <input type='email' name='email' />
                <input type='date' name='date' />
                <button type='submit'>Submit New Birthday</button>
            </form>
        </div>
    );
};

export default GatedActions;

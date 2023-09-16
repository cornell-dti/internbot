import { exec } from "@/core/send-coffee-chats";

const SendCoffeeChats = () => {
    const action = async () => {
        "use server";
        await exec();
    };

    return (
        <form action={action}>
            <button type='submit'>Manually send a round of coffee chats</button>
        </form>
    );
};

export default SendCoffeeChats;

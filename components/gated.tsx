import { Suspense } from "react";
import BotStatus from "./gated/bot-status";
import SendCoffeeChats from "./gated/send-coffee-chats";
import AddBirthday from "./gated/add-birthday";

const GatedComponents = () => {
    return (
        <>
            <BotStatus />
            <SendCoffeeChats />
            <AddBirthday />
        </>
    );
};

export default GatedComponents;

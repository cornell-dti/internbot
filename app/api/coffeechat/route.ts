import { NextResponse } from "next/server";
import { exec } from "@/core/send-coffee-chats";

export async function POST() {
    await exec();
    return NextResponse.json({
        message: "Coffee chats sent!",
    });
}

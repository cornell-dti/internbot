import { NextResponse } from "next/server";
import { exec } from "@/core/send-birthday";

export async function POST() {
    await exec();
    return NextResponse.json({
        message: "Birthday messages sent for the day!",
    });
}

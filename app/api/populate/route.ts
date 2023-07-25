import { NextResponse } from "next/server";
import { exec } from "@/core/new-semester";

export async function POST() {
    await exec();
    return NextResponse.json({
        message: "Database populated!",
    });
}

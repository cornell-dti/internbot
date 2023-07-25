import { NextResponse } from "next/server";
import { exec } from "@/core/populate-sem-users";

export async function POST() {
    await exec();
    return NextResponse.json({
        message: "Database populated!",
    });
}

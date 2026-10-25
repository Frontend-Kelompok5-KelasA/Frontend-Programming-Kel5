import { NextResponse } from "next/server";
import {getSession} from "@/backend-scripts/session-handler";

export async function GET(){
    const session = await getSession();

    return NextResponse.json(session.userData || null);
}
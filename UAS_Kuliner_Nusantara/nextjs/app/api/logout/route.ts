import { getSession } from "@/backend-scripts/session-handler";
import {NextResponse} from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(){
    const session = await getSession();
    session.destroy();

    return NextResponse.json({ success: true });
}

export async function POST(){
    const session = await getSession();
    session.destroy();

    return NextResponse.json({ success: true });

}
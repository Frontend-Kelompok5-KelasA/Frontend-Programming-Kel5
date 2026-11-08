import { getPrisma } from "@/backend-scripts/database";
import { NextResponse } from "next/server";
import { getSession } from "@/backend-scripts/session-handler";
import bcrypt from "bcrypt";

export const dynamic = 'force-dynamic';

export async function POST(req: Request){
    const session = await getSession();
    if(session.userData){
        return NextResponse.json({ success: true, login: true });
    }

    try {
        const { email, username, password } = await req.json();

        if (!email || !username || !password) {
            return NextResponse.json(
                { success: false, message: "All fields must be filled" },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { success: false, message: "Minimum 8 characters for password" },
                { status: 400 }
            );
        }

        const db = getPrisma();

        const existing = await db.User.where({ email: email }).first();
        if (existing) {
            return NextResponse.json(
                { success: false, message: "Email or username already registered" },
                { status: 409 }
            );
        }

        const hashedPass = await bcrypt.hash(password, 12);

        await db.User.create({
            email: email,
            password: hashedPass,
            role: 'user',
            username: username,
            profile: ''
        });

        return NextResponse.json({ success: true, login: false });
    } catch (err: any) {
        if (err?.code === 'P2002') {
            return NextResponse.json(
                { success: false, message: "Email or username already registered" },
                { status: 409 }
            );
        }

        console.error(err);
        return NextResponse.json(
            { success: false, message: "There's a problem with the server" },
            { status: 500 }
        );
    }
}
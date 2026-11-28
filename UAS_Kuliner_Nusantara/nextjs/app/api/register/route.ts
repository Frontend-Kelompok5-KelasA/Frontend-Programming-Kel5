import { readUsers, writeUsers, nextId } from "../../../backend-scripts/store";
import { NextResponse } from "next/server";
import { getSession } from "../../../backend-scripts/session-handler";
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

        const users = await readUsers();
        if (users.some((u) => u.email === email)) {
        return NextResponse.json(
            { success: false, message: "Email or username already registered" },
            { status: 409 },
        );
        }
        const hashedPass = await bcrypt.hash(password, 12);
        users.push({
        userId: nextId(users, (u) => u.userId),
        email, password: hashedPass, role: "user", username, profile: "",
        createdAt: new Date().toLocaleString("sv-SE"),
        });
        await writeUsers(users);

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
import { getPrisma } from "@/backend-scripts/database";
import { NextResponse } from "next/server";
import { getSession } from "@/backend-scripts/session-handler";
import bcrypt from "bcrypt";

export const dynamic = 'force-dynamic';

export async function POST(req: Request){
    const session = await getSession();
    if(session.userData){
        return NextResponse.json({ success: true });
    }

    try {
        const { email, password } = await req.json();

        const db = getPrisma();

        const user = await db.User.where({
            email: email
        }).first();

        const passwordMatch = user
            ? await bcrypt.compare(password, user.password)
            : false;

        if (!user || !passwordMatch) {
            return NextResponse.json(
                { success: false, message: "Email atau password salah" },
                { status: 401 }
            );
        }

        session.userData = {
            user_id: String(user.userId),
            email: user.email,
            username: user.username,
            role: user.role
        };

        await session.save();

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: "Terjadi kesalahan pada server" },
            { status: 500 }
        );
    }
}
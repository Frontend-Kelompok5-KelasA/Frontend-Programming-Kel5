import { getPrisma } from "@/backend-scripts/database";
import { NextResponse } from "next/server";
import { getSession } from "@/backend-scripts/session-handler";
import { redirect } from "next/navigation";
const bcrypt = require('bcrypt');

export const dynamic = 'force-dynamic';

export async function POST(req: Request){
    const session = await getSession();
    if(session.userData){
        redirect('/');
    }

    const { email, password } = await req.json();

    const db = getPrisma();

    try {
        const user = await db.User.where({
            email: email
        }).first();
        if(!user){
            redirect('/admin');
        }

        const result = await bcrypt.compare(password, user.password);
        if(result){
            const session = await getSession();

            session.userData = {
                user_id: String(user.userId),
                email: user.email,
                username: user.username,
                role: user.role
            };

            await session.save();

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ success: false });
    } catch(err: any){
        return NextResponse.json({error: err.message});
    }

}
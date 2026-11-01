import { getPrisma } from "@/backend-scripts/database";
import { NextResponse } from "next/server";
import { getSession } from "@/backend-scripts/session-handler";
import { redirect } from "next/navigation";
const bcrypt = require('bcrypt');

export async function POST(req: Request){
    const session = await getSession();
    if(session.userData){
        return NextResponse.json({ success: true, login: true });
    }

    const {email, username, password} = await req.json();

    const hashedPass = await bcrypt.hash(password, 15);

    const db = getPrisma();

    try {
        await db.User.create({
            email: email,
            password: hashedPass,
            role: 'user',
            username: username,
            profile: ''
        });

        return NextResponse.json({ success: true, login: false });
    } catch(err: any){
        return NextResponse.json({error: err.message});
    }

}
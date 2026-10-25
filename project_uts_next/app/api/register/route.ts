import { getDatabase } from "@/backend-scripts/database";
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

    const db = await getDatabase();

    try {
        await db.run(
            'INSERT INTO user (email, password, role, username) VALUES (?, ?, ?, ?)',
            [email, hashedPass, 'user', username]
        );

        return NextResponse.json({ success: true, login: false });
    } catch(err: any){
        return NextResponse.json({error: err.message});
    }

}
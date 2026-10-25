import { getDatabase } from "@/backend-scripts/database";
import { NextResponse } from "next/server";

export async function GET(){
    const query = 'SELECT user_id, email, username, role FROM user ORDER BY user_id';

    try {
        const db = await getDatabase();
        const result = await db.all(query);
        return NextResponse.json(result);
    } catch(err: any){
        return NextResponse.json({ error: err.message });
    }
}
import { getPrisma } from "@/backend-scripts/database";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const db = getPrisma();

        const result = await db.User
            .orderBy(fields => fields.userId.desc())
            .all();

        return NextResponse.json(result);
    } catch(err: any){
        return NextResponse.json({ error: err.message });
    }
}
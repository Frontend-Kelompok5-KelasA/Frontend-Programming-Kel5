import { getDb } from "@/backend-scripts/database";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const db = await getDb();

        const result = await db.get(`
            SELECT
                (SELECT COUNT(*) FROM "User") AS user,
                (SELECT COUNT(*) FROM "Restaurant") AS restoran,
                (SELECT COUNT(*) FROM "Review") AS review
        `);

        return NextResponse.json(result);
    } catch(err: any){
        return NextResponse.json({ error: err.message });
    }
}
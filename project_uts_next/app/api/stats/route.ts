import { getDatabase } from "@/backend-scripts/database";
import { NextResponse } from "next/server";

export async function GET(){
    const query = `
        SELECT
                (SELECT COUNT(*) FROM user) AS user,
            (SELECT COUNT(*) FROM restaurant) AS restoran,
            (SELECT COUNT(*) FROM review) AS review
    `;

    try {
        const db = await getDatabase();
        const result = await db.all(query);
        return NextResponse.json(result);
    } catch(err: any){
        return NextResponse.json({ error: err.message });
    }
}
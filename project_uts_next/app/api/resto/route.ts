import { getDatabase } from "@/backend-scripts/database";
import { NextResponse } from "next/server";

export async function GET(){
    const query = `SELECT id, name, city, place, description AS desc, cat, tag, status, open_hour, rating, price, official_website, instagram, image FROM restaurant`;

    try {
        const db = await getDatabase();
        const result = await db.all(query);
        return NextResponse.json(result);
    } catch(err: any){
        return NextResponse.json({ error: err.message });
    }
}
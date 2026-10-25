import { getDatabase } from "@/backend-scripts/database";
import { NextResponse } from "next/server";

export async function GET(){
    const query = `
        SELECT rv.review_id, rv.rating, rv.comment, rv.created_at,
            u.username,
            rs.id AS restaurant_id, rs.name AS restaurant_name, rs.city
        FROM review rv
        LEFT JOIN user u ON u.user_id = rv.user_id
        LEFT JOIN restaurant rs ON rs.id = rv.restaurant_id
        ORDER BY rv.review_id DESC`;

    const db = await getDatabase();

    try {
        const rows = await db.all(query, []);

        return NextResponse.json({ scope: 'all', reviews: rows });
    } catch (err: any){
        return NextResponse.json({ error: err.message });
    }

}
import { getDb } from "@/backend-scripts/database";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const db = await getDb();

        const rows = await db.all(`
            SELECT rv.review_id,
                   rv.rating,
                   rv.comment,
                   rv.created_at,
                   u.username,
                   rs.id   AS restaurant_id,
                   rs.name AS restaurant_name,
                   rs.city
            FROM "Review" rv
            LEFT JOIN "User" u ON u.user_id = rv.user_id
            LEFT JOIN "Restaurant" rs ON rs.id = rv.restaurant_id
            ORDER BY rv.review_id DESC
        `);

        return NextResponse.json({ scope: 'all', reviews: rows });
    } catch (err: any){
        return NextResponse.json({ error: err.message });
    }

}
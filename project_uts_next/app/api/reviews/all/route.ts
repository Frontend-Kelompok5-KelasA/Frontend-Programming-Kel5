import { getRawPrisma } from "@/backend-scripts/database";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const db = getRawPrisma();

        const plan = db.raw.sql`
            SELECT rv.review_id,
                   rv.rating,
                   rv.comment,
                   rv.created_at,
                   u.username,
                   rs.id   AS restaurant_id,
                   rs.name AS restaurant_name,
                   rs.city
            FROM public."Review" rv
                     LEFT JOIN public."User" u ON u.user_id = rv.user_id
                     LEFT JOIN public."Restaurant" rs ON rs.id = rv.restaurant_id
            ORDER BY rv.review_id DESC
        `
            .returnsRow({
                review_id: 'pg/numeric@1',
                rating: 'pg/numeric@1',
                comment: 'pg/text@1',
                created_at: 'pg/text@1',
                username: 'pg/text@1',
                restaurant_id: 'pg/text@1',
                restaurant_name: 'pg/text@1',
                city: 'pg/text@1'
            })
            .build();

        const rows = await db.query(plan);

        return NextResponse.json({ scope: 'all', reviews: rows });
    } catch (err: any){
        return NextResponse.json({ error: err.message });
    }

}
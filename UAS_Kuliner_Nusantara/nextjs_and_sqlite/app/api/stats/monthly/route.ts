import { getDb } from "@/backend-scripts/database";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const db = await getDb();
        const rows = await db.all(`
            WITH RECURSIVE months(m) AS (
                SELECT 1
                UNION ALL
                SELECT m + 1 FROM months WHERE m < 12
            )
            SELECT
                0 AS user,
                0 AS restoran,
                (SELECT COUNT(*) FROM "Review" v
                    WHERE CAST(strftime('%m', v.created_at) AS INTEGER) = m
                      AND strftime('%Y', v.created_at) = strftime('%Y', 'now')) AS review
            FROM months
            ORDER BY m
        `);

        return NextResponse.json({
            user: rows.map((r: any) => Number(r.user)),
            restoran: rows.map((r: any) => Number(r.restoran)),
            review: rows.map((r: any) => Number(r.review)),
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
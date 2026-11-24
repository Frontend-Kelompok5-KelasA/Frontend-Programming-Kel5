import { getRawPrisma } from "@/backend-scripts/database";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const db = getRawPrisma();

        const plan = db.raw.sql`
            SELECT COUNT(v."created_at") AS total
            FROM generate_series(1, 12) AS m
            LEFT JOIN public."Review" v
                ON EXTRACT(MONTH FROM v."created_at"::timestamp) = m
            AND EXTRACT(YEAR FROM v."created_at"::timestamp) = EXTRACT(YEAR FROM CURRENT_DATE)
            GROUP BY m
            ORDER BY m
        `
            .returnsRow({
                total: 'pg/numeric@1',
            })
            .build();

        const rows = await db.query(plan);

        return NextResponse.json({
            reviews: rows.map((r: any) => Number(r.total)),
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
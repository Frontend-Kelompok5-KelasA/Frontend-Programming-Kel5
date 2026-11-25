import { getRawPrisma } from "@/backend-scripts/database";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const db = getRawPrisma();

        const plan = db.raw.sql`
            SELECT
                (SELECT COUNT(*) FROM public."User" u
                    WHERE EXTRACT(MONTH FROM u."created_at"::timestamp) = m
                      AND EXTRACT(YEAR FROM u."created_at"::timestamp) = EXTRACT(YEAR FROM CURRENT_DATE)) AS user,
                (SELECT COUNT(*) FROM public."Restaurant" r
                    WHERE EXTRACT(MONTH FROM r."created_at"::timestamp) = m
                      AND EXTRACT(YEAR FROM r."created_at"::timestamp) = EXTRACT(YEAR FROM CURRENT_DATE)) AS restoran,
                (SELECT COUNT(*) FROM public."Review" v
                    WHERE EXTRACT(MONTH FROM v."created_at"::timestamp) = m
                      AND EXTRACT(YEAR FROM v."created_at"::timestamp) = EXTRACT(YEAR FROM CURRENT_DATE)) AS review
            FROM generate_series(1, 12) AS m
            ORDER BY m
        `
            .returnsRow({
                user: 'pg/numeric@1',
                restoran: 'pg/numeric@1',
                review: 'pg/numeric@1',
            })
            .build();

        const rows = await db.query(plan);

        return NextResponse.json({
            user: rows.map((r: any) => Number(r.user)),
            restoran: rows.map((r: any) => Number(r.restoran)),
            review: rows.map((r: any) => Number(r.review)),
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
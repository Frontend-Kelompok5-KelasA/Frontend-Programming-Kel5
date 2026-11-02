import {getPrisma, getRawPrisma} from "@/backend-scripts/database";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const db = getRawPrisma();

        const plan = db.raw.sql`
            SELECT
                (SELECT COUNT(*) FROM public."User") AS user,
                (SELECT COUNT(*) FROM public."Restaurant") AS restoran,
                (SELECT COUNT(*) FROM public."Review") AS review
        `
            .returnsRow({
                user: 'pg/numeric@1',
                restoran: 'pg/numeric@1',
                review: 'pg/numeric@1'
            })
            .build();

        const result = await db.query(plan);

        return NextResponse.json(result[0]);
    } catch(err: any){
        return NextResponse.json({ error: err.message });
    }
}
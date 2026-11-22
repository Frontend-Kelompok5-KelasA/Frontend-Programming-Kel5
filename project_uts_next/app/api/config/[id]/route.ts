import { getPrisma, getRawPrisma } from "@/backend-scripts/database";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }){
    const pageId = (await params).id;

    const db = getPrisma();

    try {
        const result = await db.Page.where({
            pageId: pageId
        }).first();

        if(!result){
            return NextResponse.json({ config: null });
        }

        return NextResponse.json({ config: JSON.parse(result.configuration) });
    } catch(err: any){
        return NextResponse.json({error: err.message});
    }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }){
    const pageId = (await params).id;

    const { pageData } = await req.json();

    const db = getRawPrisma();

    const data = JSON.stringify(pageData);

    try {
        const plan = db.raw.sql`
            UPDATE public."Page"
            SET configuration = ${data}
            WHERE page_id = ${pageId}
        `
          .returnsRow({})
          .build();

        const result = await db.query(plan);

        return NextResponse.json({ success: true });
    } catch(err: any){
        return NextResponse.json({error: err.message});
    }
}
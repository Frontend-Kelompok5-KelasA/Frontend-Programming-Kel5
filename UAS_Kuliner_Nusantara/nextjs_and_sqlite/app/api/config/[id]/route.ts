import { getDb } from "@/backend-scripts/database";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }){
    const pageId = (await params).id;

    try {
        const db = await getDb();

        const result = await db.get(
            'SELECT configuration FROM "Page" WHERE page_id = ?',
            [pageId]
        );

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

    const data = JSON.stringify(pageData);

    try {
        const db = await getDb();
        await db.run(
            'UPDATE "Page" SET configuration = ? WHERE page_id = ?',
            [data, pageId]
        );

        return NextResponse.json({ success: true });
    } catch(err: any){
        return NextResponse.json({error: err.message});
    }
}
import { getPrisma } from "@/backend-scripts/database";
import { NextResponse } from "next/server";
import { getSession } from "@/backend-scripts/session-handler";
import { redirect } from "next/navigation";
const bcrypt = require('bcrypt');

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
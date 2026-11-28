import { getDb } from "@/backend-scripts/database";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(){
  try {
    const db = await getDb();
    const result = await db.all('SELECT page_id AS pageId FROM "Page"');

    if(!result){
      return NextResponse.json({ pages: null });
    }

    return NextResponse.json({ pages: result.map(
      (e) => e.pageId
    )});
  } catch(err: any){
    return NextResponse.json({error: err.message});
  }
}
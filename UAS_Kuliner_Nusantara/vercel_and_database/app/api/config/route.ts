import { getPrisma, getRawPrisma } from "@/backend-scripts/database";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(){
  const db = getPrisma();

  try {
    const result = await db.Page.select("pageId").all();

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
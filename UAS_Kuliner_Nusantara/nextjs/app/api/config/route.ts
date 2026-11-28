import { NextResponse } from "next/server";
import { readPages } from "@/backend-scripts/store";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ pages: Object.keys(await readPages()) });
}
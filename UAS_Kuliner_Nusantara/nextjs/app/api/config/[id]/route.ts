import { NextResponse } from "next/server";
import { readPages, writePages } from "@/backend-scripts/store";

export const dynamic = "force-dynamic";
type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const pages = await readPages();
  return NextResponse.json({ config: pages[(await params).id] ?? null });
}

export async function POST(req: Request, { params }: Ctx) {
  const id = (await params).id;
  const { pageData } = await req.json();
  const pages = await readPages();
  pages[id] = pageData;
  await writePages(pages);
  return NextResponse.json({ success: true });
}
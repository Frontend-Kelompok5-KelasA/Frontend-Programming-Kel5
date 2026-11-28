import { NextResponse } from "next/server";
import { readUsers, readRestos, readReviews, perMonth } from "@/backend-scripts/store";

export async function GET() {
  const [u, r, v] = await Promise.all([readUsers(), readRestos(), readReviews()]);
  return NextResponse.json({
    user: perMonth(u.map((x) => x.createdAt)),
    restoran: perMonth(r.map((x) => x.created_at)),
    review: perMonth(v.map((x) => x.createdAt)),
  });
}
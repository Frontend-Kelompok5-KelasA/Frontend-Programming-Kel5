import { NextResponse } from "next/server";
import { readUsers, readRestos, readReviews } from "@/backend-scripts/store";

export async function GET() {
  const [u, r, v] = await Promise.all([readUsers(), readRestos(), readReviews()]);
  return NextResponse.json({ user: u.length, restoran: r.length, review: v.length });
}
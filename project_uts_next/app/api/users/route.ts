import { getPrisma } from "@/backend-scripts/database";
import { NextResponse } from "next/server";
import { requireRole } from "@/backend-scripts/auth-guard";

export async function GET() {
  const auth = await requireRole(["admin"]);
  if (auth.error) return auth.error;

  try {
    const db = getPrisma();

    const result = await db.User.orderBy((fields) =>
      fields.userId.desc(),
    ).all();

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}

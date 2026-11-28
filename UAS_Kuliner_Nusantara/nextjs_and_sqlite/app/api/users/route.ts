import { getDb } from "@/backend-scripts/database";
import { NextResponse } from "next/server";
import { requireRole } from "@/backend-scripts/auth-guard";

export async function GET() {
  const auth = await requireRole(["admin"]);
  if (auth.error) return auth.error;

  try {
    const db = await getDb();

    const result = await db.all(
      'SELECT user_id AS userId, username, email, role FROM "User" ORDER BY user_id DESC',
    );

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}

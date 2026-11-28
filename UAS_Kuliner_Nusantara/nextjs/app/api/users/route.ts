import { NextResponse } from "next/server";
import { requireRole } from "@/backend-scripts/auth-guard";
import { readUsers } from "@/backend-scripts/store";

export async function GET() {
  const auth = await requireRole(["admin"]);
  if (auth.error) return auth.error;

  const users = await readUsers();
  return NextResponse.json(
    users
      .slice()
      .sort((a, b) => b.userId - a.userId)
      .map(({ userId, username, email, role }) => ({ userId, username, email, role })),
  );
}
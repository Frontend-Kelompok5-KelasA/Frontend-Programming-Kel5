import { NextResponse } from "next/server";
import { getSession } from "./session-handler";

export async function requireRole(roles: string[]) {
  const user = (await getSession()).userData;

  if (!user) {
    return {
      user: null,
      error: NextResponse.json(
        { error: "Silakan login terlebih dahulu." },
        { status: 401 },
      ),
    };
  }
  if (!roles.includes(user.role)) {
    return {
      user: null,
      error: NextResponse.json({ error: "Access denied." }, { status: 403 }),
    };
  }
  return { user, error: null };
}

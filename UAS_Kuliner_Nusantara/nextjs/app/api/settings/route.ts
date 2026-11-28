import { NextResponse } from "next/server";
import { requireRole } from "../../../backend-scripts/auth-guard";
import { getSession } from "../../../backend-scripts/session-handler";
import { readUsers, writeUsers } from "../../../backend-scripts/store";
import bcrypt from "bcrypt";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request) {
  const auth = await requireRole(["user", "admin"]);
  if (auth.error) return auth.error;

  try {
    const userId = Number(auth.user.user_id);
    if (!Number.isSafeInteger(userId)) {
      return NextResponse.json({ error: "Sesi tidak valid." }, { status: 400 });
    }

    const body = await req.json();
    const username = String(body?.username ?? "").trim();
    const currentPassword = String(body?.currentPassword ?? "");
    const newPassword = String(body?.newPassword ?? "");

    if (!username) {
      return NextResponse.json(
        { error: "Username wajib diisi." },
        { status: 400 },
      );
    }
    if (username.length > 50) {
      return NextResponse.json(
        { error: "Username maksimal 50 karakter." },
        { status: 400 },
      );
    }

    const users = await readUsers();
    const idx = users.findIndex((u) => u.userId === userId);
    const user = users[idx];

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan." },
        { status: 404 },
      );
    }

    let newHash: string | null = null;
    if (newPassword) {
      if (newPassword.length < 8) {
        return NextResponse.json(
          { error: "Password baru minimal 8 karakter." },
          { status: 400 },
        );
      }
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Password saat ini wajib diisi untuk mengganti password." },
          { status: 400 },
        );
      }
      const cocok = await bcrypt.compare(currentPassword, user.password);
      if (!cocok) {
        return NextResponse.json(
          { error: "Password saat ini salah." },
          { status: 400 },
        );
      }
      newHash = await bcrypt.hash(newPassword, 12);
    }

    users[idx] = { ...user, username, ...(newHash ? { password: newHash } : {}) };
    await writeUsers(users);

    const session = await getSession();
    if (session.userData) {
      session.userData = { ...session.userData, username };
      await session.save();
    }

    return NextResponse.json({ success: true, username });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Terjadi masalah pada server." },
      { status: 500 },
    );
  }
}

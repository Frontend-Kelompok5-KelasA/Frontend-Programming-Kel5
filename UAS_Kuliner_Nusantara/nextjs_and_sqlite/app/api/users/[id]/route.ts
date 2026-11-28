import { getDb } from "@/backend-scripts/database";
import { NextResponse } from "next/server";
import { requireRole } from "@/backend-scripts/auth-guard";
import { getSession } from "@/backend-scripts/session-handler";
const bcrypt = require("bcrypt");

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireRole(["admin"]);
  if (auth.error) return auth.error;

  try {
    const userId = Number((await params).id);

    if (!Number.isSafeInteger(userId)) {
      return NextResponse.json(
        { error: "ID user tidak valid." },
        { status: 400 },
      );
    }

    const db = await getDb();
    const user = await db.get(
      'SELECT user_id AS userId, username, email, role FROM "User" WHERE user_id = ?',
      [userId],
    );

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      userId: user.userId,
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireRole(["admin"]);
  if (auth.error) return auth.error;

  try {
    const userId = Number((await params).id);

    if (!Number.isSafeInteger(userId)) {
      return NextResponse.json(
        { error: "ID user tidak valid." },
        { status: 400 },
      );
    }

    const { userData } = await req.json();
    const username = String(userData?.username ?? "").trim();
    const email = String(userData?.email ?? "").trim();
    const role = String(userData?.role ?? "").trim();
    const password = String(userData?.password ?? "");

    if (!username || !email) {
      return NextResponse.json(
        { error: "Username dan email wajib diisi." },
        { status: 400 },
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Format email tidak valid." },
        { status: 400 },
      );
    }
    if (!["user", "admin", "restaurant"].includes(role)) {
      return NextResponse.json(
        { error: "Role harus user, admin, atau restaurant." },
        { status: 400 },
      );
    }
    if (password && password.length < 8) {
      return NextResponse.json(
        { error: "Password minimal 8 karakter." },
        { status: 400 },
      );
    }

    const isSelf = String(auth.user.user_id) === String(userId);
    if (isSelf && role !== "admin") {
      return NextResponse.json(
        { error: "Admin tidak bisa menurunkan role akunnya sendiri." },
        { status: 400 },
      );
    }

    const db = await getDb();
    const dipakai = await db.get(
      'SELECT user_id AS userId FROM "User" WHERE email = ?',
      [email],
    );

    if (dipakai && dipakai.userId !== userId) {
      return NextResponse.json(
        { error: "Email sudah dipakai user lain." },
        { status: 409 },
      );
    }

    const res = password
      ? await db.run(
          'UPDATE "User" SET username = ?, email = ?, role = ?, password = ? WHERE user_id = ?',
          [username, email, role, await bcrypt.hash(password, 12), userId],
        )
      : await db.run(
          'UPDATE "User" SET username = ?, email = ?, role = ? WHERE user_id = ?',
          [username, email, role, userId],
        );

    if (!res.changes) {
      return NextResponse.json(
        { error: "User tidak ditemukan." },
        { status: 404 },
      );
    }

    if (isSelf) {
      const session = await getSession();
      if (session.userData) {
        session.userData = { ...session.userData, username, email, role };
        await session.save();
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireRole(["admin"]);
  if (auth.error) return auth.error;

  try {
    const userId = Number((await params).id);

    if (!Number.isSafeInteger(userId)) {
      return NextResponse.json(
        { error: "ID user tidak valid." },
        { status: 400 },
      );
    }

    if (String(auth.user.user_id) === String(userId)) {
      return NextResponse.json(
        { error: "Admin tidak bisa menghapus akunnya sendiri." },
        { status: 400 },
      );
    }

    const db = await getDb();

    const res = await db.run('DELETE FROM "User" WHERE user_id = ?', [userId]);

    if (!res.changes) {
      return NextResponse.json(
        { error: "User tidak ditemukan." },
        { status: 404 },
      );
    }

    await db.run('DELETE FROM "Review" WHERE user_id = ?', [userId]);
    await db.run('DELETE FROM "Favorite" WHERE user_id = ?', [userId]);
    await db.run('UPDATE "Restaurant" SET user_id = NULL WHERE user_id = ?', [userId]);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

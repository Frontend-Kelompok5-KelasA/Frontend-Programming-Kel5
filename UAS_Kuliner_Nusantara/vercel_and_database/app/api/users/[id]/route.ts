import { getPrisma, getRawPrisma } from "../../../../backend-scripts/database";
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

    const db = getPrisma();
    const user = await db.User.where({ userId }).first();

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
    if (!["user", "admin"].includes(role)) {
      return NextResponse.json(
        { error: "Role harus user atau admin." },
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

    const orm = getPrisma();
    const dipakai = await orm.User.where({ email }).first();
    if (dipakai && dipakai.userId !== userId) {
      return NextResponse.json(
        { error: "Email sudah dipakai user lain." },
        { status: 409 },
      );
    }

    const db = getRawPrisma();

    const plan = password
      ? db.raw.sql`
          UPDATE public."User"
          SET username = ${username},
              email = ${email},
              role = ${role},
              password = ${await bcrypt.hash(password, 12)}
          WHERE user_id = ${userId}
          RETURNING user_id
        `
          .returnsRow({ user_id: "pg/numeric@1" })
          .build()
      : db.raw.sql`
          UPDATE public."User"
          SET username = ${username},
              email = ${email},
              role = ${role}
          WHERE user_id = ${userId}
          RETURNING user_id
        `
          .returnsRow({ user_id: "pg/numeric@1" })
          .build();

    const rows = await db.query(plan);

    if (rows.length === 0) {
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

    const db = getRawPrisma();

    const hapusUser = db.raw.sql`
      DELETE FROM public."User"
      WHERE user_id = ${userId}
      RETURNING user_id
    `
      .returnsRow({ user_id: "pg/numeric@1" })
      .build();

    const rows = await db.query(hapusUser);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "User tidak ditemukan." },
        { status: 404 },
      );
    }

    const hapusReview = db.raw.sql`
      DELETE FROM public."Review"
      WHERE user_id = ${userId}
      RETURNING review_id
    `
      .returnsRow({ review_id: "pg/numeric@1" })
      .build();
    await db.query(hapusReview);

    const hapusFavorite = db.raw.sql`
      DELETE FROM public."Favorite"
      WHERE user_id = ${userId}
      RETURNING favorite_id
    `
      .returnsRow({ favorite_id: "pg/numeric@1" })
      .build();
    await db.query(hapusFavorite);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

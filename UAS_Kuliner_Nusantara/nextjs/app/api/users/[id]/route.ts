import { readUsers, writeUsers, readReviews, writeReviews, readFavorites, writeFavorites, readRestos, writeRestos } from "@/backend-scripts/store";
import { NextResponse } from "next/server";
import { requireRole } from "@/backend-scripts/auth-guard";
import { getSession } from "@/backend-scripts/session-handler";
import bcrypt from "bcrypt";

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

    const user = (await readUsers()).find((u) => u.userId === userId);

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

    const users = await readUsers();
    const idx = users.findIndex((u) => u.userId === userId);
    if (idx === -1)
      return NextResponse.json({ error: "User tidak ditemukan." }, { status: 404 });

    if (users.some((u) => u.email === email && u.userId !== userId))
      return NextResponse.json({ error: "Email sudah dipakai user lain." }, { status: 409 });

    users[idx] = {
      ...users[idx],
      username, email, role,
      ...(password ? { password: await bcrypt.hash(password, 12) } : {}),
    };
    await writeUsers(users);

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

    const users = await readUsers();
    if (!users.some((u) => u.userId === userId))
      return NextResponse.json({ error: "User tidak ditemukan." }, { status: 404 });

    await writeUsers(users.filter((u) => u.userId !== userId));
    await writeReviews((await readReviews()).filter((r) => r.userId !== userId));
    await writeFavorites((await readFavorites()).filter((f) => f.userId !== userId));
    await writeRestos(
      (await readRestos()).map((r) => (r.user_id === userId ? { ...r, user_id: null } : r)),
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

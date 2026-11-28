import { getDb } from "@/backend-scripts/database";
import { NextResponse } from "next/server";
import { requireRole } from "@/backend-scripts/auth-guard";
import { randomUUID } from "crypto";

export async function GET(req: Request) {
  try {
    const db = await getDb();
    const selectResto = `
      SELECT r.id, r.name, r.city, r.place, r.description, r.description AS desc,
             r.cat, r.tag, r.status, r.open_hour AS openHour, r.rating, r.price,
             r.official_website AS officialWebsite, r.instagram, r.image,
             r.user_id AS userId, COALESCE(u.email, '-') AS email
      FROM "Restaurant" r
      LEFT JOIN "User" u ON u.user_id = r.user_id
    `;

    const { searchParams } = new URL(req.url);
    if (searchParams.get("mine") === "true") {
      const auth = await requireRole(["restaurant"]);
      if (auth.error) return auth.error;

      const milikSaya = await db.all(`${selectResto} WHERE r.user_id = ?`, [
        Number(auth.user.user_id),
      ]);
      return NextResponse.json(milikSaya);
    }

    const dataDenganEmail = await db.all(selectResto);

    return NextResponse.json(dataDenganEmail);
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}

export async function POST(req: Request) {
  const auth = await requireRole(["admin"]);
  if (auth.error) return auth.error;

  try {
    const b = await req.json();
    const str = (v: unknown) => String(v ?? "").trim();

    const name = str(b.name);
    if (!name) {
      return NextResponse.json(
        { error: "Nama restoran wajib diisi." },
        { status: 400 },
      );
    }

    const rating = Number(b.rating || 0);
    if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
      return NextResponse.json(
        { error: "Rating harus 0 sampai 5." },
        { status: 400 },
      );
    }

    const image = str(b.image);
    const isValidImage =
      !image ||
      image.startsWith("https://") ||
      image.startsWith("/images/") ||
      /^[a-zA-Z0-9._-]+$/.test(image);
    if (!isValidImage) {
      return NextResponse.json(
        { error: "URL atau nama file gambar tidak valid." },
        { status: 400 },
      );
    }

    let id = str(b.id);
    if (!id) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      id = `${slug || "resto"}-${randomUUID().slice(0, 6)}`;
    }

    const db = await getDb();

    const sudahAda = await db.get('SELECT id FROM "Restaurant" WHERE id = ?', [id]);
    if (sudahAda) {
      return NextResponse.json(
        { error: `ID "${id}" sudah dipakai.` },
        { status: 409 },
      );
    }

    await db.run(
      `INSERT INTO "Restaurant"
       (id, name, city, place, description, cat, tag, status, open_hour, rating, price, official_website, instagram, image, user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        name,
        str(b.city),
        str(b.place),
        str(b.desc),
        str(b.cat),
        str(b.tag),
        str(b.status),
        str(b.open_hour),
        rating,
        str(b.price),
        str(b.official_website),
        str(b.instagram),
        image,
        b.user_id ? Number(b.user_id) : null,
      ],
    );

    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

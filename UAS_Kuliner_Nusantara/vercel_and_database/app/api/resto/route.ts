import { getPrisma } from "@/backend-scripts/database";
import { NextResponse } from "next/server";
import { requireRole } from "@/backend-scripts/auth-guard";
import { randomUUID } from "crypto";

export async function GET() {
  try {
    const db = getPrisma();

    const result = (await db.Restaurant.all()).map((restaurant) => {
      return {
        ...restaurant,
        desc: restaurant.description,
      };
    });

    return NextResponse.json(result);
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
    if (image && !image.startsWith("https://")) {
      return NextResponse.json(
        { error: "URL gambar tidak valid." },
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

    const db = getPrisma();

    const sudahAda = await db.Restaurant.where({ id }).all();
    if (sudahAda.length > 0) {
      return NextResponse.json(
        { error: `ID "${id}" sudah dipakai.` },
        { status: 409 },
      );
    }

    await db.Restaurant.create({
      id,
      name,
      city: str(b.city),
      place: str(b.place),
      description: str(b.desc),
      cat: str(b.cat),
      tag: str(b.tag),
      status: str(b.status),
      openHour: str(b.open_hour),
      rating,
      price: str(b.price),
      officialWebsite: str(b.official_website),
      instagram: str(b.instagram),
      image,
    });

    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

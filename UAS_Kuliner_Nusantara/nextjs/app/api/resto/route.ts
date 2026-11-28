import { NextResponse } from "next/server";
import { requireRole } from "../../../backend-scripts/auth-guard";
import { randomUUID } from "crypto";
import { readRestos, writeRestos, readUsers, toApiResto } from "@/backend-scripts/store";

export async function GET(req: Request) {
  try {
    const restos = await readRestos();
    const { searchParams } = new URL(req.url);

    if (searchParams.get("mine") === "true") {
      const auth = await requireRole(["restaurant"]);
      if (auth.error) return auth.error;
      return NextResponse.json(
        restos
          .filter((r) => r.user_id === Number(auth.user.user_id))
          .map((r) => toApiResto(r)),
      );
    }

    const users = await readUsers();
    return NextResponse.json(
      restos.map((r) =>
        toApiResto(r, users.find((u) => u.userId === r.user_id)?.email ?? "-"),
      ),
    );
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

    const restos = await readRestos();
    if (restos.some((r) => r.id === id)) {
      return NextResponse.json(
        { error: `ID "${id}" sudah dipakai.` },
        { status: 409 },
      );
    }

    restos.push({
      id,
      name,
      city: str(b.city),
      place: str(b.place),
      desc: str(b.desc),
      cat: str(b.cat),
      tag: str(b.tag),
      status: str(b.status),
      open_hour: str(b.open_hour),
      rating,
      price: str(b.price),
      official_website: str(b.official_website),
      instagram: str(b.instagram),
      image,
      user_id: b.user_id ? Number(b.user_id) : null,
      created_at: new Date().toLocaleString("sv-SE"),
    });
    await writeRestos(restos);

    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

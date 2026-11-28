import { requireRole } from "@/backend-scripts/auth-guard";
import { NextResponse } from "next/server";
import { readRestos, writeRestos, readReviews, writeReviews, toApiResto } from "../../../../backend-scripts/store";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const auth = await requireRole(["admin", "restaurant"]);
  if (auth.error) return auth.error;

  const id = (await params).id;
  const resto = (await readRestos()).find((r) => r.id === id);
  if (!resto)
    return NextResponse.json({ error: "Restoran tidak ditemukan." }, { status: 404 });
  if (auth.user.role === "restaurant" && resto.user_id !== Number(auth.user.user_id))
    return NextResponse.json({ error: "Anda tidak memiliki akses ke restoran ini." }, { status: 403 });

  return NextResponse.json(toApiResto(resto));
}

export async function POST(req: Request, { params }: Ctx) {
  const auth = await requireRole(["admin", "restaurant"]);
  if (auth.error) return auth.error;

  try {
    const id = (await params).id;
    const restos = await readRestos();
    const idx = restos.findIndex((r) => r.id === id);
    if (idx === -1)
      return NextResponse.json({ error: "Restoran tidak ditemukan." }, { status: 404 });

    const existing = restos[idx];
    if (auth.user.role === "restaurant" && existing.user_id !== Number(auth.user.user_id))
      return NextResponse.json({ error: "Anda hanya dapat mengedit restoran milik Anda sendiri." }, { status: 403 });

    const { restoData } = await req.json();
    const isAdmin = auth.user.role === "admin";

    restos[idx] = {
      ...existing,
      name: restoData.name,
      city: restoData.city,
      place: restoData.place,
      desc: restoData.description,
      cat: restoData.cat,
      tag: restoData.tag,
      status: restoData.status,
      open_hour: restoData.openHour,
      price: restoData.price,
      official_website: restoData.officialWebsite,
      instagram: restoData.instagram,
      image:
        typeof restoData.image === "string" && restoData.image.trim() !== ""
          ? restoData.image
          : existing.image,
      rating: isAdmin ? Number(restoData.rating ?? existing.rating) : existing.rating,
      user_id: isAdmin
        ? restoData.userId ? Number(restoData.userId) : null
        : existing.user_id ?? null,
    };

    await writeRestos(restos);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const auth = await requireRole(["admin"]);
  if (auth.error) return auth.error;

  try {
    const id = (await params).id;
    const restos = await readRestos();
    if (!restos.some((r) => r.id === id))
      return NextResponse.json({ error: "Restoran tidak ditemukan." }, { status: 404 });

    await writeRestos(restos.filter((r) => r.id !== id));
    await writeReviews((await readReviews()).filter((rv) => rv.restaurantId !== id));
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
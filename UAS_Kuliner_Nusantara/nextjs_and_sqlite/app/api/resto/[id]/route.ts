import { getDb } from "@/backend-scripts/database";
import { requireRole } from "@/backend-scripts/auth-guard";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireRole(["admin", "restaurant"]);
  if (auth.error) return auth.error;

  try {
    const restoId = (await params).id;
    const db = await getDb();
    const resto = await db.get(
      `SELECT id, name, city, place, description, cat, tag, status,
              open_hour AS openHour, rating, price,
              official_website AS officialWebsite, instagram, image,
              user_id AS userId
       FROM "Restaurant" WHERE id = ?`,
      [restoId],
    );

    if (!resto) {
      return NextResponse.json(
        { error: "Restoran tidak ditemukan." },
        { status: 404 },
      );
    }

    if (
      auth.user.role === "restaurant" &&
      resto.userId !== Number(auth.user.user_id)
    ) {
      return NextResponse.json(
        { error: "Anda tidak memiliki akses ke restoran ini." },
        { status: 403 },
      );
    }

    return NextResponse.json(resto);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {

  const auth = await requireRole(["admin", "restaurant"]);
  if (auth.error) return auth.error;

  try {
    const restoId = (await params).id;

    const db = await getDb();
    const existing = await db.get(
      'SELECT id, rating, image, user_id AS userId FROM "Restaurant" WHERE id = ?',
      [restoId],
    );

    if (!existing) {
      return NextResponse.json(
        { error: "Restoran tidak ditemukan." },
        { status: 404 },
      );
    }

    if (
      auth.user.role === "restaurant" &&
      existing.userId !== Number(auth.user.user_id)
    ) {
      return NextResponse.json(
        { error: "Anda hanya dapat mengedit restoran milik Anda sendiri." },
        { status: 403 },
      );
    }
    
    const { restoData } = await req.json();

    const finalRating =
      auth.user.role === "admin"
        ? Number(restoData.rating ?? existing.rating)
        : existing.rating;

    const finalUserId =
      auth.user.role === "admin"
        ? restoData.userId
          ? Number(restoData.userId)
          : null
        : existing.userId;

    const finalImage =
      typeof restoData.image === "string" && restoData.image.trim() !== ""
        ? restoData.image
        : existing.image;

    await db.run(
      `UPDATE "Restaurant"
       SET cat = ?, city = ?, description = ?, image = ?, instagram = ?,
           name = ?, official_website = ?, open_hour = ?, place = ?,
           price = ?, rating = ?, status = ?, tag = ?, user_id = ?
       WHERE id = ?`,
      [
        restoData.cat,
        restoData.city,
        restoData.description,
        finalImage,
        restoData.instagram,
        restoData.name,
        restoData.officialWebsite,
        restoData.openHour,
        restoData.place,
        restoData.price,
        finalRating,
        restoData.status,
        restoData.tag,
        finalUserId,
        restoId,
      ],
    );

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
    const restoId = (await params).id;
    const db = await getDb();

    const res = await db.run('DELETE FROM "Restaurant" WHERE id = ?', [restoId]);

    if (!res.changes) {
      return NextResponse.json(
        { error: "Restoran tidak ditemukan." },
        { status: 404 },
      );
    }

    await db.run('DELETE FROM "Review" WHERE restaurant_id = ?', [restoId]);
    await db.run('DELETE FROM "RestaurantPhoto" WHERE restaurant_id = ?', [restoId]);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

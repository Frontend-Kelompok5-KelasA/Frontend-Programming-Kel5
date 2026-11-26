import { getPrisma, getRawPrisma } from "@/backend-scripts/database";
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
    const db = getPrisma();
    const resto = await db.Restaurant.where({ id: restoId }).first();

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

    const orm = getPrisma();
    const existing = await orm.Restaurant.where({ id: restoId }).first();
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

    const db = getRawPrisma();

    const plan =
      finalUserId !== null
        ? db.raw.sql`
            UPDATE public."Restaurant"
            SET cat = ${restoData.cat},
                city = ${restoData.city},
                description = ${restoData.description},
                image = ${finalImage},
                instagram = ${restoData.instagram},
                name = ${restoData.name},
                official_website = ${restoData.officialWebsite},
                open_hour = ${restoData.openHour},
                place = ${restoData.place},
                price = ${restoData.price},
                rating = ${finalRating},
                status = ${restoData.status},
                tag = ${restoData.tag},
                user_id = ${finalUserId}
            WHERE id = ${restoId}
          `
            .returnsRow({})
            .build()
        : db.raw.sql`
            UPDATE public."Restaurant"
            SET cat = ${restoData.cat},
                city = ${restoData.city},
                description = ${restoData.description},
                image = ${finalImage},
                instagram = ${restoData.instagram},
                name = ${restoData.name},
                official_website = ${restoData.officialWebsite},
                open_hour = ${restoData.openHour},
                place = ${restoData.place},
                price = ${restoData.price},
                rating = ${finalRating},
                status = ${restoData.status},
                tag = ${restoData.tag},
                user_id = NULL
            WHERE id = ${restoId}
          `
            .returnsRow({})
            .build();

    await db.query(plan);

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
    const db = getRawPrisma();

    const hapusResto = db.raw.sql`
      DELETE FROM public."Restaurant"
      WHERE id = ${restoId}
      RETURNING id
    `
      .returnsRow({ id: "pg/text@1" })
      .build();

    const rows = await db.query(hapusResto);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Restoran tidak ditemukan." },
        { status: 404 },
      );
    }
    const hapusReview = db.raw.sql`
      DELETE FROM public."Review"
      WHERE restaurant_id = ${restoId}
      RETURNING review_id
    `
      .returnsRow({ review_id: "pg/numeric@1" })
      .build();
    await db.query(hapusReview);

    const hapusFoto = db.raw.sql`
      DELETE FROM public."RestaurantPhoto"
      WHERE restaurant_id = ${restoId}
      RETURNING photo_id
    `
      .returnsRow({ photo_id: "pg/numeric@1" })
      .build();
    await db.query(hapusFoto);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

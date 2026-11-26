import { getPrisma, getRawPrisma } from "@/backend-scripts/database";
import { requireRole } from "@/backend-scripts/auth-guard";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const restoId = (await params).id;

    const { restoData } = await req.json();

    const db = getRawPrisma();

    const plan = db.raw.sql`
          UPDATE public."Restaurant"
          SET cat = ${restoData.cat}, 
              city = ${restoData.city}, 
              description = ${restoData.description},
              image = ${restoData.image}, 
              instagram = ${restoData.instagram}, 
              name = ${restoData.name},
              official_website = ${restoData.officialWebsite}, 
              open_hour = ${restoData.openHour},
              place = ${restoData.place}, 
              price = ${restoData.price}, 
              rating = ${restoData.rating},
              status = ${restoData.status}, 
              tag = ${restoData.tag}
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

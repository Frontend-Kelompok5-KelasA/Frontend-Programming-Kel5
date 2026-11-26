import { getPrisma, getRawPrisma } from "../../../../backend-scripts/database";
import { NextResponse } from "next/server";
import { requireRole } from "@/backend-scripts/auth-guard";

async function parseId(params: Promise<{ id: string }>) {
  const reviewId = Number((await params).id);
  return Number.isSafeInteger(reviewId) ? reviewId : null;
}

const invalidId = () =>
  NextResponse.json({ error: "ID review tidak valid." }, { status: 400 });

const notFound = () =>
  NextResponse.json({ error: "Review tidak ditemukan." }, { status: 404 });

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireRole(["user"]);
  if (auth.error) return auth.error;

  try {
    const reviewId = await parseId(params);
    if (reviewId === null) return invalidId();

    const db = getRawPrisma();
    const plan = db.raw.sql`
      SELECT rv.review_id, rv.rating, rv.comment, rv.created_at,
             rs.id AS restaurant_id, rs.name AS restaurant_name, rs.city
      FROM public."Review" rv
      LEFT JOIN public."Restaurant" rs ON rs.id = rv.restaurant_id
      WHERE rv.review_id = ${reviewId}
        AND rv.user_id = ${Number(auth.user.user_id)}
    `
      .returnsRow({
        review_id: "pg/numeric@1",
        rating: "pg/numeric@1",
        comment: "pg/text@1",
        created_at: "pg/text@1",
        restaurant_id: "pg/text@1",
        restaurant_name: "pg/text@1",
        city: "pg/text@1",
      })
      .build();

    const rows = await db.query(plan);
    if (rows.length === 0) return notFound();

    return NextResponse.json(rows[0]);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireRole(["user"]);
  if (auth.error) return auth.error;

  try {
    const reviewId = await parseId(params);
    if (reviewId === null) return invalidId();

    const { rating, comment } = await req.json();

    const nilai = Number(rating);
    if (!Number.isInteger(nilai) || nilai < 1 || nilai > 5) {
      return NextResponse.json(
        { error: "Rating harus angka 1 sampai 5." },
        { status: 400 },
      );
    }

    const teks = String(comment ?? "").trim();
    if (!teks) {
      return NextResponse.json(
        { error: "Komentar tidak boleh kosong." },
        { status: 400 },
      );
    }
    if (teks.length > 1000) {
      return NextResponse.json(
        { error: "Komentar maksimal 1000 karakter." },
        { status: 400 },
      );
    }

    const db = getRawPrisma();

    const plan = db.raw.sql`
      UPDATE public."Review"
      SET rating = ${nilai},
          comment = ${teks}
      WHERE review_id = ${reviewId}
        AND user_id = ${Number(auth.user.user_id)}
      RETURNING review_id
    `
      .returnsRow({ review_id: "pg/numeric@1" })
      .build();

    const rows = await db.query(plan);
    if (rows.length === 0) return notFound();

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireRole(["admin", "user"]);
  if (auth.error) return auth.error;

  try {
    const reviewId = await parseId(params);
    if (reviewId === null) return invalidId();

    const db = getRawPrisma();

    const plan =
      auth.user.role === "admin"
        ? db.raw.sql`
            DELETE FROM public."Review"
            WHERE review_id = ${reviewId}
            RETURNING review_id
          `
            .returnsRow({ review_id: "pg/numeric@1" })
            .build()
        : db.raw.sql`
            DELETE FROM public."Review"
            WHERE review_id = ${reviewId}
              AND user_id = ${Number(auth.user.user_id)}
            RETURNING review_id
          `
            .returnsRow({ review_id: "pg/numeric@1" })
            .build();

    const rows = await db.query(plan);
    if (rows.length === 0) return notFound();

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { getPrisma, getRawPrisma } from "../../../../backend-scripts/database";
import { NextResponse } from "next/server";
import { requireRole } from "@/backend-scripts/auth-guard";

export async function PUT() {
  try {
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
    const reviewId = Number((await params).id);

    if (!Number.isSafeInteger(reviewId)) {
      return NextResponse.json(
        { error: "ID review tidak valid." },
        { status: 400 },
      );
    }

    const db = getRawPrisma();

    const plan = db.raw.sql`
      DELETE FROM public."Review"
      WHERE review_id = ${reviewId}
      RETURNING review_id
    `
      .returnsRow({ review_id: "pg/numeric@1" })
      .build();

    const rows = await db.query(plan);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Review tidak ditemukan." },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

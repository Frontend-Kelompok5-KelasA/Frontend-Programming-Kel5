import { NextResponse } from "next/server";
import { requireRole } from "@/backend-scripts/auth-guard";
import { readReviews, writeReviews, joinReviews } from "@/backend-scripts/store";

type Ctx = { params: Promise<{ id: string }> };

async function parseId(params: Ctx["params"]) {
  const n = Number((await params).id);
  return Number.isSafeInteger(n) ? n : null;
}
const invalidId = () => NextResponse.json({ error: "ID review tidak valid." }, { status: 400 });
const notFound = () => NextResponse.json({ error: "Review tidak ditemukan." }, { status: 404 });

export async function GET(_req: Request, { params }: Ctx) {
  const auth = await requireRole(["user"]);
  if (auth.error) return auth.error;

  const id = await parseId(params);
  if (id === null) return invalidId();

  const row = (await joinReviews()).find(
    (r) => r.review_id === id && r.user_id === Number(auth.user.user_id),
  );
  return row ? NextResponse.json(row) : notFound();
}

export async function PUT(req: Request, { params }: Ctx) {
  const auth = await requireRole(["user"]);
  if (auth.error) return auth.error;

  try {
    const id = await parseId(params);
    if (id === null) return invalidId();

    const { rating, comment } = await req.json();
    const nilai = Number(rating);
    if (!Number.isInteger(nilai) || nilai < 1 || nilai > 5)
      return NextResponse.json({ error: "Rating harus angka 1 sampai 5." }, { status: 400 });

    const teks = String(comment ?? "").trim();
    if (!teks)
      return NextResponse.json({ error: "Komentar tidak boleh kosong." }, { status: 400 });
    if (teks.length > 1000)
      return NextResponse.json({ error: "Komentar maksimal 1000 karakter." }, { status: 400 });

    const reviews = await readReviews();
    const idx = reviews.findIndex(
      (r) => r.reviewId === id && r.userId === Number(auth.user.user_id),
    );
    if (idx === -1) return notFound();

    reviews[idx] = { ...reviews[idx], rating: nilai, comment: teks };
    await writeReviews(reviews);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const auth = await requireRole(["admin", "user"]);
  if (auth.error) return auth.error;

  try {
    const id = await parseId(params);
    if (id === null) return invalidId();

    const reviews = await readReviews();
    const sisa = reviews.filter(
      (r) =>
        !(
          r.reviewId === id &&
          (auth.user.role === "admin" || r.userId === Number(auth.user.user_id))
        ),
    );
    if (sisa.length === reviews.length) return notFound();

    await writeReviews(sisa);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
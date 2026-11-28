import { NextResponse } from "next/server";
import { getSession } from "@/backend-scripts/session-handler";
import { redirect } from "next/navigation";
import { requireRole } from "@/backend-scripts/auth-guard";
import { readRestos, readReviews, writeReviews, joinReviews, nextId } from "../../../backend-scripts/store";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const auth = await requireRole(["user"]);
  if (auth.error) return auth.error;

  const { restaurant_id, rating, comment } = await req.json();

  const nilai = Number(rating);
  if (!Number.isInteger(nilai) || nilai < 1 || nilai > 5)
    return NextResponse.json({ error: "Rating harus angka 1 sampai 5." });

  const teks = (comment || "").trim();
  if (!teks) return NextResponse.json({ error: "Komentar tidak boleh kosong." });
  if (teks.length > 1000)
    return NextResponse.json({ error: "Komentar maksimal 1000 karakter." });

  try {
    const restos = await readRestos();
    if (!restos.some((r) => r.id === restaurant_id))
      return NextResponse.json({ error: "Restoran tidak ditemukan." });

    const reviews = await readReviews();
    reviews.push({
      reviewId: nextId(reviews, (r) => r.reviewId),
      userId: Number(auth.user.user_id),
      restaurantId: restaurant_id,
      rating: nilai,
      comment: teks,
      createdAt: new Date().toLocaleString("sv-SE"),
    });
    await writeReviews(reviews);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}

export async function GET(req: Request) {
  const user = (await getSession()).userData;
  if (!user) redirect("/auth/login");

  const reqScope = new URL(req.url).searchParams.get("scope");

  try {
    const rows = await joinReviews();
    let result = rows;
    let scope = "mine";

    if (user.role === "admin") {
      scope = "all";
    } else if (user.role === "restaurant" && reqScope === "restaurant") {
      scope = "restaurant";
      result = rows.filter((r) => String(r.owner_id) === String(user.user_id));
    } else {
      result = rows.filter((r) => String(r.user_id) === String(user.user_id));
    }

    return NextResponse.json({ scope, reviews: result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}
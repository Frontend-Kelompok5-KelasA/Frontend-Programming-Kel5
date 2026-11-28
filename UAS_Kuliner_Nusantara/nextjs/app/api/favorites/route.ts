import { NextResponse } from "next/server";
import { getSession } from "@/backend-scripts/session-handler";
import { readFavorites, writeFavorites, readRestos, nextId } from "../../../backend-scripts/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = (await getSession()).userData;
  if (!user)
    return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
  if (user.role !== "user")
    return NextResponse.json({ error: "Hanya user yang dapat mengakses Favorite." }, { status: 403 });

  const all = await readFavorites();
  return NextResponse.json({
    favorites: all
      .filter((f) => f.userId === Number(user.user_id))
      .map((f) => f.restaurantId),
  });
}

export async function POST(req: Request) {
  const user = (await getSession()).userData;
  if (!user)
    return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
  if (user.role !== "user")
    return NextResponse.json({ error: "Hanya user yang dapat mengubah Favorite." }, { status: 403 });

  try {
    const { restaurantKey, action } = await req.json();

    if (typeof restaurantKey !== "string" || !restaurantKey.trim())
      return NextResponse.json({ error: "Identitas restoran tidak valid." }, { status: 400 });
    if (action !== "add" && action !== "remove")
      return NextResponse.json({ error: "Action tidak valid." }, { status: 400 });

    const key = restaurantKey.trim().toLowerCase();
    const userId = Number(user.user_id);
    const favorites = await readFavorites();

    if (action === "add") {
      const restos = await readRestos();
      if (!restos.some((r) => r.name.trim().toLowerCase() === key))
        return NextResponse.json({ error: "Restoran tidak ditemukan." }, { status: 404 });

      const sudahAda = favorites.some(
        (f) => f.userId === userId && f.restaurantId === key,
      );
      if (!sudahAda) {
        favorites.push({
          favoriteId: nextId(favorites, (f) => f.favoriteId),
          userId,
          restaurantId: key,
          createdAt: new Date().toLocaleString("sv-SE"),
        });
        await writeFavorites(favorites);
      }
      return NextResponse.json({ ok: true, isFavorite: true });
    }

    await writeFavorites(
      favorites.filter((f) => !(f.userId === userId && f.restaurantId === key)),
    );
    return NextResponse.json({ ok: true, isFavorite: false });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
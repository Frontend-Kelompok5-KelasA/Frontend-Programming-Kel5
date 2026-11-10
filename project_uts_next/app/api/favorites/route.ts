import { getPrisma, getRawPrisma } from "@/backend-scripts/database";
import { NextResponse } from "next/server";
import { getSession } from "../../../backend-scripts/session-handler";

export const dynamic = "force-dynamic";

// Mengambil daftar favorite milik user yang sedang login
export async function GET() {
    const session = await getSession();
    const user = session.userData;

    if (!user) {
        return NextResponse.json(
            { error: "Silakan login terlebih dahulu." },
            { status: 401 }
        );
    }

    if (user.role !== "user") {
        return NextResponse.json(
            { error: "Hanya user yang dapat mengakses Favorite." },
            { status: 403 }
        );
    }

    try {
        const db = getPrisma();

        const favorites = await db.Favorite
            .where({ userId: Number(user.user_id) })
            .all();

        return NextResponse.json({
            favorites: favorites.map((item) => item.restaurantId)
        });

    } catch (err: any) {
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        );
    }
}


// Menambahkan atau menghapus favorite
export async function POST(req: Request) {
    const session = await getSession();
    const user = session.userData;

    if (!user) {
        return NextResponse.json(
            { error: "Silakan login terlebih dahulu." },
            { status: 401 }
        );
    }

    if (user.role !== "user") {
        return NextResponse.json(
            { error: "Hanya user yang dapat mengubah Favorite." },
            { status: 403 }
        );
    }

    try {
        const { restaurantKey, action } = await req.json();

        if (
            typeof restaurantKey !== "string" ||
            !restaurantKey.trim()
        ) {
            return NextResponse.json(
                { error: "Identitas restoran tidak valid." },
                { status: 400 }
            );
        }

        const key = restaurantKey.trim().toLowerCase();
        const userId = Number(user.user_id);

        if (!Number.isSafeInteger(userId)) {
            return NextResponse.json(
                { error: "User ID tidak valid." },
                { status: 400 }
            );
        }

        if (action !== "add" && action !== "remove") {
            return NextResponse.json(
                { error: "Action tidak valid." },
                { status: 400 }
            );
        }

        const db = getPrisma();

        // Memastikan restoran memang tersedia di database
        if (action === "add") {
            const restaurants = await db.Restaurant.all();

            const resto = restaurants.find(
                (r) => r.name.trim().toLowerCase() === key
            );

            if (!resto) {
                return NextResponse.json(
                    { error: "Restoran tidak ditemukan." },
                    { status: 404 }
                );
            }

            // Memeriksa apakah restoran sudah menjadi Favorite
            const existing = await db.Favorite
                .where({
                    userId: userId,
                    restaurantId: key
                })
                .all();

            // Simpan hanya kalau blom ada
            if (existing.length === 0) {
                await db.Favorite.create({
                    userId: userId,
                    restaurantId: key,
                    createdAt: new Date().toLocaleString("sv-SE")
                });
            }

            return NextResponse.json({
                ok: true,
                isFavorite: true
            });
        }

        // Menghapus Favorite berdasarkan user dan restoran
        const rawDb = getRawPrisma();

        const plan = rawDb.raw.sql`
            DELETE FROM public."Favorite"
            WHERE user_id = ${userId}
            AND restaurant_id = ${key}
            RETURNING favorite_id
        `
            .returnsRow({
                favorite_id: "pg/numeric@1"
            })
            .build();

        await rawDb.query(plan);

        return NextResponse.json({
            ok: true,
            isFavorite: false
        });

    } catch (err: any) {
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        );
    }
}

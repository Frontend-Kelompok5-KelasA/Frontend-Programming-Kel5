"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Restaurant {
    id: number;
    name: string;
    city: string;
    place: string;
    description: string;
    desc?: string;
    cat: string;
    tag: string;
    status: string;
    openHour: string;
    rating: number;
    price: string;
    officialWebsite: string;
    instagram: string;
    image: string;
}

interface FavoriteResto {
    key: string;
    name: string;
    desc: string;
    image: string;
    cat: string;
    tag: string;
    status: string;
    officialWebsite: string;
    instagram: string;
    locations: Restaurant[];
}

export default function Favorites() {
    const [restos, setRestos] = useState<FavoriteResto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadFavorites() {
            try {
                // Mengambil daftar Favorite user
                const favoriteResponse = await fetch("/api/favorites", {
                    cache: "no-store"
                });

                if (!favoriteResponse.ok) {
                    throw new Error("Gagal mengambil data Favorite.");
                }

                const favoriteData = await favoriteResponse.json();
                const favoriteKeys: string[] = favoriteData.favorites;

                // Jika belum ada restoran yang difavoritkan
                if (favoriteKeys.length === 0) {
                    setRestos([]);
                    return;
                }

                // Mengambil seluruh data restoran
                const restoResponse = await fetch("/api/resto", {
                    cache: "no-store"
                });

                if (!restoResponse.ok) {
                    throw new Error("Gagal mengambil data restoran.");
                }

                const restoData = await restoResponse.json();

                // Menyesuaikan data restoran dengan Favorite user
                const grouped = new Map<string, FavoriteResto>();

                restoData.forEach((r: Restaurant) => {
                    const key = r.name.trim().toLowerCase();

                    // Hanya mengambil restoran yang ada di Favorite
                    if (!favoriteKeys.includes(key)) return;

                    if (!grouped.has(key)) {
                        grouped.set(key, {
                            key: key,
                            name: r.name,
                            desc: r.description,
                            image: r.image,
                            cat: r.cat,
                            tag: r.tag,
                            status: r.status,
                            officialWebsite: r.officialWebsite,
                            instagram: r.instagram,
                            locations: []
                        });
                    }

                    grouped.get(key)!.locations.push(r);
                });

                setRestos(Array.from(grouped.values()));

            } catch (err: any) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadFavorites();
    }, []);

    return (
        <main>
            <div className="main-container">
                <div className="list-resto">
                    <h2>Your Favorite Resto</h2>

                    {loading && <p>Loading...</p>}

                    {!loading && error && (
                        <p>{error}</p>
                    )}

                    {!loading && !error && restos.length === 0 && (
                        <p>Kamu belum menyukai restoran</p>
                    )}

                    {!loading && !error && restos.length > 0 && (
                        <div className="food-list">
                            {restos.map((resto) => (
                                <div className="card favresto" key={resto.key} style={{ "maxWidth": "500px" }}>
                                    <Image src={`/images/restaurantImages/${resto.image || "default.png"}`} className="card-img-top" alt={resto.name} width={200} height={200} />

                                    <div className="card-body">
                                        <h5 className="card-title">
                                            {resto.name}
                                        </h5>
                                        <p className="card-text">
                                            {resto.desc}
                                        </p>

                                        <p className="card-loc">
                                            📍 {resto.locations[0]?.city || "-"}
                                            {resto.locations.length > 1 && (
                                                <small>
                                                    {" "} (+{resto.locations.length - 1} cabang lain)
                                                </small>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

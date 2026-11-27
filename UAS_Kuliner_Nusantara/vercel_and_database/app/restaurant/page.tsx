"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadSession } from "@/script/utils";

interface SessionUser {
  user_id: string;
  username: string;
  email: string;
  role: string;
}

interface RestaurantData {
  id: string;
  name: string;
  city: string;
  place: string;
  description: string;
  cat: string;
  tag: string;
  status: string;
  openHour: string;
  rating: number;
  price: string;
  image: string;
}

interface ReviewItem {
  review_id: number;
  restaurant_id: string;
  restaurant_name: string;
  city: string;
  rating: number;
  comment: string;
  created_at: string;
  username: string;
  email: string;
}

export default function RestaurantDashboard() {
  const [session, setSession] = useState<SessionUser | null>(null);
  const [branches, setBranches] = useState<RestaurantData[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSession();

    const loadData = async () => {
      try {
        const sessionRes = await fetch("/api/session", { cache: "no-store" });
        const userData: SessionUser | null = await sessionRes.json();

        if (!userData || userData.role !== "restaurant") {
          window.location.href = "/login";
          return;
        }
        setSession(userData);

        const [restoRes, reviewRes] = await Promise.all([
          fetch("/api/resto?mine=true", { cache: "no-store" }),
          fetch("/api/reviews", { cache: "no-store" }),
        ]);

        if (restoRes.ok) {
          const restoList = await restoRes.json();
          setBranches(Array.isArray(restoList) ? restoList : []);
        } else {
          setError("Gagal memuat daftar toko Anda.");
        }

        if (reviewRes.ok) {
          const revJson = await reviewRes.json();
          setReviews(revJson.reviews ?? []);
        }
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data dashboard restoran.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredReviews = reviews.filter((r) => {
    const matchBranch =
      selectedBranch === "all" || r.restaurant_id === selectedBranch;
    const kw = search.trim().toLowerCase();
    const matchSearch =
      !kw ||
      [r.restaurant_name, r.city, r.username, r.email, r.comment].some((v) =>
        String(v ?? "").toLowerCase().includes(kw)
      );
    return matchBranch && matchSearch;
  });

  const avgRating = filteredReviews.length
    ? (
        filteredReviews.reduce((sum, r) => sum + Number(r.rating), 0) /
        filteredReviews.length
      ).toFixed(2)
    : "-";

  if (loading) {
    return (
      <main className="container py-5 text-center">
        <p>Memuat dashboard restoran...</p>
      </main>
    );
  }

  return (
    <main className="container py-4">
      <div className="mb-4">
        <h1 className="fw-bold mb-1">Dashboard Restoran</h1>
        <p className="text-muted mb-0">
          Selamat datang, {session?.username} &bull; {branches.length} toko/cabang terdaftar
        </p>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <section className="mb-5">
        <h3 className="fw-bold mb-3">Toko &amp; Cabang Saya</h3>

        {branches.length === 0 ? (
          <div className="alert alert-warning" role="alert">
            Belum ada restoran/cabang yang terhubung ke akun Anda. Hubungi admin untuk menghubungkan toko Anda.
          </div>
        ) : (
          <div className="row g-4">
            {branches.map((resto) => (
              <div key={resto.id} className="col-12 col-md-6">
                <div className="card h-100">
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex gap-3 mb-3 align-items-start">
                      {resto.image && (
                        <img
                          src={resto.image}
                          alt={resto.name}
                          className="rounded"
                          style={{ width: 100, height: 100, objectFit: "cover" }}
                        />
                      )}
                      <div className="flex-grow-1">
                        <h5 className="fw-bold mb-1">{resto.name}</h5>
                        <p className="text-muted small mb-1">
                          {resto.city} &bull; {resto.cat} &bull; {resto.status}
                        </p>
                        <span className="small">⭐ {resto.rating} &bull; {resto.price}</span>
                      </div>
                    </div>

                    <p className="small mb-2">{resto.description}</p>
                    <p className="small text-muted mb-3">
                      <strong>Alamat:</strong> {resto.place}
                      <br />
                      <strong>Jam Buka:</strong> {resto.openHour}
                    </p>

                    <div className="mt-auto">
                      <Link
                        href={`/restaurant/edit/${resto.id}`}
                        className="btn-tambah d-inline-block text-center text-decoration-none w-100"
                      >
                        Edit Toko Ini
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="card">
        <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h4 className="mb-0 fw-bold">Review Pelanggan</h4>
            <small className="text-muted">
              {filteredReviews.length} review &bull; Rata-rata rating: {avgRating}
            </small>
          </div>
          <div className="d-flex flex-wrap gap-2">
            {branches.length > 1 && (
              <select
                className="form-select"
                style={{ maxWidth: 220 }}
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
              >
                <option value="all">Semua Cabang</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.city})
                  </option>
                ))}
              </select>
            )}
            <input
              type="search"
              className="form-control"
              style={{ maxWidth: 240 }}
              placeholder="Cari review..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="card-body table-responsive">
          <table className="table table-bordered table-striped table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>No</th>
                <th>Tanggal</th>
                <th>Cabang / Restoran</th>
                <th>Pengguna</th>
                <th>Rating</th>
                <th>Komentar</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-muted">
                    {reviews.length === 0
                      ? "Belum ada review untuk restoran Anda."
                      : "Tidak ada review yang cocok dengan filter."}
                  </td>
                </tr>
              ) : (
                filteredReviews.map((rev, index) => (
                  <tr key={rev.review_id}>
                    <td>{index + 1}</td>
                    <td className="text-nowrap">{rev.created_at || "-"}</td>
                    <td>
                      <strong>{rev.restaurant_name || rev.restaurant_id}</strong>
                      <br />
                      <small className="text-muted">{rev.city || "-"}</small>
                    </td>
                    <td>
                      <strong>{rev.username || "-"}</strong>
                      <br />
                      <small className="text-muted">{rev.email || ""}</small>
                    </td>
                    <td className="text-nowrap">⭐ {rev.rating}/5</td>
                    <td style={{ whiteSpace: "pre-wrap" }}>{rev.comment}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
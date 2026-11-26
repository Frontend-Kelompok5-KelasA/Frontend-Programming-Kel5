"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Card } from "react-bootstrap";

type ReviewForm = {
  rating: string;
  comment: string;
};

export default function EditReviewById() {
  const { id } = useParams();
  const router = useRouter();

  const [process, setProcess] = useState<boolean>(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  // info restoran hanya ditampilkan (tidak bisa diubah)
  const [restaurant, setRestaurant] = useState("");

  const { register, handleSubmit, reset } = useForm<ReviewForm>({
    defaultValues: { rating: "5", comment: "" },
  });

  const onSubmit = async (values: ReviewForm) => {
    setProcess(true);
    setSuccess(false);
    setError("");

    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: Number(values.rating),
          comment: values.comment,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error ?? "Gagal memperbarui review.");
        return;
      }

      setSuccess(true);
      reset(values);
    } catch {
      setError("Gagal memperbarui review.");
    } finally {
      setProcess(false);
    }
  };

  useEffect(() => {
    const retrieveData = async () => {
      try {
        const res = await fetch(`/api/reviews/${id}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error ?? "Gagal mengambil data review.");
          return;
        }

        setRestaurant(
          `${data.restaurant_name ?? data.restaurant_id}${data.city ? ` (${data.city})` : ""}`,
        );
        reset({
          rating: String(data.rating),
          comment: data.comment ?? "",
        });
      } catch {
        setError("Gagal mengambil data review.");
      }
    };

    retrieveData();
  }, [id, reset]);

  return (
    <main className="container d-flex flex-column justify-content-center align-items-center py-4 min-vh-100">
      <Card className="w-100">
        <Card.Header>
          <Card.Title>
            <h2 className="fw-bold fs-3 text-center"> Edit Review </h2>
          </Card.Title>
          <Card.Subtitle>
            <h2 className="fw-semibold fs-5 text-center"> (ID: {id}) </h2>
          </Card.Subtitle>
        </Card.Header>
        <Card.Body>
          {success && (
            <div className="alert alert-success text-center py-2" role="alert">
              Berhasil Memperbaharui Data
            </div>
          )}
          {error && (
            <div className="alert alert-danger text-center py-2" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="restaurant" className="form-label">
                Restoran
              </label>
              <input
                id="restaurant"
                type="text"
                readOnly
                disabled
                className="form-control"
                value={restaurant}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="rating" className="form-label">
                Rating
              </label>
              <select
                id="rating"
                className="form-select"
                {...register("rating")}
              >
                <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                <option value="5">⭐⭐⭐⭐ (4)</option>
                <option value="5">⭐⭐⭐ (3)</option>
                <option value="5">⭐⭐ (2)</option>
                <option value="5">⭐ (1)</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="comment" className="form-label">
                Komentar
              </label>
              <textarea
                id="comment"
                rows={5}
                required
                maxLength={1000}
                className="form-control"
                {...register("comment")}
              />
            </div>

            <div className="d-grid mt-4">
              <button type="submit" disabled={process} className="btn-tambah">
                {process ? "Menyimpan..." : "Apply Changes"}
              </button>
            </div>

            <div className="d-grid mt-2">
              <button
                type="button"
                className="btn-tambah"
                onClick={() => router.push("/profile")}
              >
                Kembali ke Profile
              </button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </main>
  );
}

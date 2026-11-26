"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Card } from "react-bootstrap";
import { upload } from "@vercel/blob/client";

type OwnerOption = {
  userId: number;
  username: string;
  email: string;
  role: string;
};

export default function EditRestoById() {
  const { id } = useParams();

  const [data, setData] = useState<Record<string, any>>({})

  const [role, setRole] = useState<string | null>(null);

  const [owners, setOwners] = useState<OwnerOption[]>([]);

  const [errorMsg, setErrorMsg] = useState("");

  const [forbidden, setForbidden] = useState(false);

  const [process, setProcess] = useState<boolean>(false);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: structuredClone(data),
  });

  const [success, setSuccess] = useState(false);

  const onSubmit = async (result: any) => {
    setProcess(true);
    setSuccess(false);
    setErrorMsg("");

    try {
      let cloned = structuredClone(result);

      const file = result.image?.[0];
      if (file instanceof File) {
        const blob = await upload(`uploads/${Date.now()}-${file.name}`, file, {
          access: "public",
          handleUploadUrl: "/api/vercel-blob",
        });
        // @ts-ignore
        cloned.image = blob.url;
      } else {
        // @ts-ignore
        cloned.image = data.image;
      }

      const res = await fetch(`/api/resto/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restoData: cloned }),
      });

      const resJson = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMsg(resJson.error || "Gagal memperbarui data.");
        return;
      }

      setData((prev) => ({ ...prev, ...cloned }));
      setSuccess(true);
    } catch {
      setErrorMsg("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setProcess(false);
    }
  };

  const formatName = (name: string) => {
    const formatted = name
      .replace("cat", "category")
      .replace("officialWebsite", "official Website")
      .replace("openHour", "open Hour")
      .replace("userId", "Pemilik Restoran");
    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1);
  };

  useEffect(() => {
    const retrieveData = async () => {
      const [sessionRes, response] = await Promise.all([
        fetch("/api/session", { cache: "no-store" }),
        fetch(`/api/resto/${id}`, { cache: "no-store" }),
      ]);

      const session = await sessionRes.json();
      const currentRole = session?.role ?? null;
      setRole(currentRole);

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        setErrorMsg(err.error || "Tidak dapat memuat data restoran.");
        setForbidden(true);
        return;
      }

      const result = await response.json();
      setData(result ?? {});

      reset({
        ...result,
        userId: result?.userId ? String(result.userId) : "",
        image: undefined,
      });

      if (currentRole === "admin") {
        const usersRes = await fetch("/api/users", { cache: "no-store" });
        if (usersRes.ok) {
          const users: OwnerOption[] = await usersRes.json();
          setOwners(users.filter((u) => u.role === "restaurant"));
        }
      }
    };

    retrieveData();
  }, [id, reset]);

  return (
    <main className="container d-flex flex-column justify-content-center align-items-center py-4 min-vh-100">
      <Card className="w-100">
        <Card.Header>
          <div className="mb-2">
            <Link
              href={role === "restaurant" ? "/restaurant" : "/restoran_detail"}
              className="btn btn-outline-secondary btn-sm"
            >
              &larr; Kembali
            </Link>
          </div>
          <Card.Title>
            <h2 className="fw-bold fs-3 text-center"> Edit Restaurant </h2>
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
          {errorMsg && (
            <div className="alert alert-danger text-center py-2" role="alert">
              {errorMsg}
            </div>
          )}
          {!forbidden && (
            <form onSubmit={handleSubmit((result) => onSubmit(result))}>
              {Object.entries(data).map(([name, val]: [string, any]) => {
                if (name === "desc" || name === "id") return null;
                if ((name === "rating" || name === "userId") && role === "restaurant") {
                  return null;
                }

                if (name === "userId") {
                  return (
                    <div key={name} className="mb-3">
                      <span className="form-label"> {formatName(name)} </span>
                      <select
                        className="form-select"
                        // @ts-ignore
                        {...register("userId")}
                      >
                        <option value="">-- Belum ada pemilik --</option>
                        {owners.map((owner) => (
                          <option key={owner.userId} value={String(owner.userId)}>
                            {owner.username} ({owner.email})
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }

                return (
                  <div key={name} className="mb-3">
                    <span className="form-label"> {formatName(name)} </span>
                    {name === "image" ? (
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          className="form-control"
                          // @ts-ignore
                          {...register(name as any)}
                        />
                        <small className="text-muted">
                          Kosongkan jika tidak ingin mengganti gambar.
                        </small>
                      </>
                    ) : (
                      <input
                        type="text"
                        required
                        defaultValue={val}
                        className="form-control"
                        // @ts-ignore
                        {...register(name as any)}
                      />
                    )}
                  </div>
                );
              })}

              <div className="d-grid mt-4">
                <Button type="submit" disabled={process} className="btn-tambah">
                  Apply Changes
                </Button>
              </div>
            </form>
          )}
        </Card.Body>
      </Card>
    </main>
  );
}
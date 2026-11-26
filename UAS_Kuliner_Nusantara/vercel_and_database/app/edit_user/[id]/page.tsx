"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Card } from "react-bootstrap";

type UserForm = {
  username: string;
  email: string;
  role: string;
  password: string;
};

export default function EditUserById() {
  const { id } = useParams();

  const [process, setProcess] = useState<boolean>(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, reset } = useForm<UserForm>({
    defaultValues: { username: "", email: "", role: "user", password: "" },
  });

  const onSubmit = async (values: UserForm) => {
    setProcess(true);
    setSuccess(false);
    setError("");

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userData: values }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error ?? "Gagal memperbarui data.");
        return;
      }

      setSuccess(true);
      reset({ ...values, password: "" });
    } catch {
      setError("Gagal memperbarui data.");
    } finally {
      setProcess(false);
    }
  };

  useEffect(() => {
    const retrieveData = async () => {
      try {
        const res = await fetch(`/api/users/${id}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error ?? "Gagal mengambil data user.");
          return;
        }

        reset({
          username: data.username,
          email: data.email,
          role: data.role,
          password: "",
        });
      } catch {
        setError("Gagal mengambil data user.");
      }
    };

    retrieveData();
  }, [id, reset]);

  return (
    <main className="container d-flex flex-column justify-content-center align-items-center py-4 min-vh-100">
      <Card className="w-100">
        <Card.Header>
          <Card.Title>
            <h2 className="fw-bold fs-3 text-center"> Edit User </h2>
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
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                className="form-control"
                {...register("username")}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="form-control"
                {...register("email")}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="role" className="form-label">
                Role
              </label>
              <select id="role" className="form-select" {...register("role")}>
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password Baru <span className="opsional">(opsional)</span>
              </label>
              <input
                id="password"
                type="password"
                minLength={8}
                autoComplete="new-password"
                placeholder="Kosongkan jika tidak ingin mengganti"
                className="form-control"
                {...register("password")}
              />
            </div>

            <div className="d-grid mt-4">
              <button type="submit" disabled={process} className="btn-tambah">
                {process ? "Menyimpan..." : "Apply Changes"}
              </button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </main>
  );
}

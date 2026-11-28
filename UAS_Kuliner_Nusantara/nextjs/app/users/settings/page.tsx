"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { loadSession } from "@/script/utils";

type SettingsForm = {
  username: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function UserSettings() {
  const [shownName, setShownName] = useState("User's Name");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, reset, watch } = useForm<SettingsForm>({
    defaultValues: {
      username: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  useEffect(() => {
    loadSession();

    fetch("/api/session", { cache: "no-store" })
      .then((r) => r.json())
      .then((session) => {
        if (!session) return;
        setShownName(session.username);
        reset({ username: session.username });
      })
      .catch(() => setError("Gagal memuat data akun."));
  }, [reset]);

  const onSubmit = async (values: SettingsForm) => {
    setSuccess(false);
    setError("");

    if (values.newPassword && values.newPassword !== values.confirmPassword) {
      setError("Konfirmasi password tidak sama.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: values.username,
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error ?? "Gagal menyimpan perubahan.");
        return;
      }

      setSuccess(true);
      setShownName(data.username);
      reset({
        username: data.username,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      document
        .querySelectorAll<HTMLElement>(".profile-username")
        .forEach((el) => {
          el.textContent = data.username;
        });
    } catch {
      setError("Gagal menyimpan perubahan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main>
      <div className="main-container">
        <Image
          className="gambar-logo"
          src="/images/websiteEssentials/profile.png"
          alt="logo"
          width={360}
          height={360}
        />

        <div className="biodata">
          <h3 id="settings-username">{shownName}</h3>
          <p>Account Settings</p>
        </div>

        <div
          className="settings container text-start"
          style={{ maxWidth: 480 }}
        >
          {success && (
            <div className="alert alert-success text-center py-2" role="alert">
              Perubahan berhasil disimpan
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
                maxLength={50}
                className="form-control"
                {...register("username")}
              />
            </div>

            <hr />

            <div className="mb-3 mt-4">
              <label htmlFor="newPassword" className="form-label">
                Password Baru <span className="opsional">(opsional)</span>
              </label>
              <input
                id="newPassword"
                type="password"
                minLength={8}
                autoComplete="new-password"
                placeholder="Kosongkan jika tidak ingin mengganti"
                className="form-control"
                {...register("newPassword")}
              />
            </div>

            {newPassword && (
              <>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Konfirmasi Password Baru
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    autoComplete="new-password"
                    className="form-control"
                    {...register("confirmPassword")}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="currentPassword" className="form-label">
                    Password Saat Ini
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="form-control"
                    {...register("currentPassword")}
                  />
                </div>
              </>
            )}

            <div className="d-grid mt-4 mb-5">
              <button type="submit" disabled={saving} className="btn-tambah">
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

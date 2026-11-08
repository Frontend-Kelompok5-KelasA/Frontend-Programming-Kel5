"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { loadSession } from "@/script/utils";

export default function EditUser() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [user, setUser] = useState<Record<string, string> | null>(null);
    const [pesan, setPesan] = useState("");

    useEffect(() => {
        loadSession();
        (async () => {
            const res = await fetch(`/api/users/${encodeURIComponent(id)}`);
            if (!res.ok) {
                setPesan("User tidak ditemukan");
                return;
            }
            setUser(await res.json());
        })();
    }, [id]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const body = Object.fromEntries(new FormData(e.currentTarget));

        const res = await fetch(`/api/users/${encodeURIComponent(id)}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (res.ok) {
            router.push("/user_detail"); // sesuaikan ke halaman tabel user
        } else {
            const data = await res.json().catch(() => ({}));
            setPesan(data.error || "Gagal menyimpan perubahan");
        }
    }

    // form baru dirender setelah data ada, karena defaultValue hanya dibaca saat render pertama
    if (!user) {
        return <main><p className="text-center">{pesan || "Memuat data..."}</p></main>;
    }

    return (
        <main>
            <div className="kotak-form">
                <h1>Edit User</h1>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input type="text" className="form-control" id="username" name="username"
                            defaultValue={user.username} required />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" className="form-control" id="email" name="email"
                            defaultValue={user.email} required />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="role" className="form-label">Role</label>
                        <select className="form-select" id="role" name="role" defaultValue={user.role}>
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Password baru <span className="opsional">(kosongkan jika tidak diganti)</span>
                        </label>
                        <input type="password" className="form-control" id="password" name="password"
                            minLength={8} autoComplete="new-password" />
                    </div>

                    <button type="submit" className="btn-tambah w-100 mt-2">Simpan Perubahan</button>
                    <p className="mt-3 text-center">{pesan}</p>
                </form>
            </div>
        </main>
    );
}
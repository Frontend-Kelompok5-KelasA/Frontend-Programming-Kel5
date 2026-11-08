"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { loadSession } from "@/script/utils";

export default function EditResto() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [resto, setResto] = useState<Record<string, string> | null>(null);
    const [pesan, setPesan] = useState("");
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        loadSession();
        (async () => {
            const res = await fetch(`/api/restaurants/${encodeURIComponent(id)}`);
            if (!res.ok) {
                setPesan("Restoran tidak ditemukan");
                return;
            }
            setResto(await res.json());
        })();
    }, [id]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!resto) return;
        const formData = new FormData(e.currentTarget);

        let imageName = resto.image; // default: pakai gambar lama
        const file = formData.get("image");

        if (file instanceof File && file.size > 0) {
            const fd = new FormData();
            fd.append("image", file);
            const upRes = await fetch("/api/upload", { method: "POST", body: fd });
            const upData = await upRes.json();
            if (!upRes.ok) {
                setPesan(upData.error);
                return;
            }
            imageName = upData.filename;
        }

        const body = Object.fromEntries(formData);
        body.image = imageName;

        const res = await fetch(`/api/restaurants/${encodeURIComponent(id)}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (res.ok) {
            router.push("/admin"); // sesuaikan ke halaman yang berisi tabel resto
        } else {
            setPesan("Gagal menyimpan perubahan");
        }
    }

    // form baru dirender setelah data ada, karena defaultValue hanya dibaca saat render pertama
    if (!resto) {
        return <main><p className="text-center">{pesan || "Memuat data..."}</p></main>;
    }

    return (
        <main>
            <div className="kotak-form">
                <h1>Edit Restoran</h1>

                <form id="form-resto" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="id" className="form-label">ID Restoran</label>
                        <input type="text" className="form-control" id="id" name="id"
                            defaultValue={resto.id} readOnly />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Nama Restoran</label>
                        <input type="text" className="form-control" id="name" name="name"
                            defaultValue={resto.name} required />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="city" className="form-label">Kota</label>
                        <select className="form-select" id="city" name="city" defaultValue={resto.city}>
                            {/* option sama persis seperti di AddResto */}
                        </select>
                    </div>

                    {/* field lain: pola yang sama.
                        input/textarea/select -> tambah defaultValue={resto.<nama_field>} */}

                    <div className="mb-3">
                        <label htmlFor="image" className="form-label">Gambar (kosongkan jika tidak diganti)</label>
                        <input type="file" className="form-control" id="image" name="image"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={(e) => {
                                const f = e.target.files?.[0];
                                setPreview(f ? URL.createObjectURL(f) : null);
                            }}
                        />
                        {preview && (<img src={preview} alt="Preview" className="mt-2" style={{ maxWidth: 200 }} />)}
                    </div>

                    <button type="submit" className="btn-tambah w-100 mt-2">Simpan Perubahan</button>
                    <p className="mt-3 text-center">{pesan}</p>
                </form>
            </div>
        </main>
    );
}
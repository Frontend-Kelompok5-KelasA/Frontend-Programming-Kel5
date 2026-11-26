"use client";

// import React Hook untuk jalanin proses setelah React selesai melakukan render komponen.
import { useEffect } from "react";
// mengambil fungsi loadSession dari file utils
import { loadSession } from "../../script/utils";
// mengambil fungsi onSession dari file review-detail
import { onLoad } from "../../script/review-detail";

export default function ReviewDetail() {
  // untuk menjalankan proses tambahan setelah komponen ditampilkan
  useEffect(() => {
    loadSession();
    onLoad();
  });

  return (
    <main>
      <div className="halaman-tabel">
        <h1>Daftar Review</h1>
        <div className="table-wrap lebar">
          <table className="table table-bordered table-striped table-hover align-middle mb-0">
            <thead>
              <tr>
                <th scope="col">No</th>
                <th scope="col">Nama User</th>
                <th scope="col">Tanggal Review</th>
                <th scope="col">Restoran</th>
                <th scope="col">Rating</th>
                <th scope="col">Komentar</th>
                <th scope="col">Hapus</th>
              </tr>
            </thead>
            <tbody id="tabel-review-body">
              <tr>
                {/* Menampilkan tulisan memuat data yang menempati seluruh lebar tabel*/}
                <td colSpan={7} className="text-center">
                  Loading data...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

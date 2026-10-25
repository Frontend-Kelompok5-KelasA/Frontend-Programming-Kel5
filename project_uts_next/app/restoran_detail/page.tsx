"use client";

import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { useEffect } from "react";
import { loadSession } from "@/script/utils";
import { onLoad } from "@/script/resto-detail";

export default function RestoDetail() {
    useEffect(() => {
        loadSession();
        onLoad();
    });

    return (
        <main>
            <Navbar />

            <section className="halaman-tabel">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h1 className="mb-0">Tabel Informasi Restoran</h1>

                    <a href="tambah_resto" className="btn-tambah">
                        <i className="bi bi-plus-lg"></i> Tambah Restoran
                    </a>
                </div>

                <div className="table-wrap">
                    <table className="table table-bordered table-striped table-hover align-middle mb-0">
                        <thead>
                            <tr>
                                <th scope="col">No</th>
                                <th scope="col">Nama Restoran</th>
                                <th scope="col">Kota</th>
                                <th scope="col">Tempat</th>
                                <th scope="col">Kategori</th>
                                <th scope="col">Status</th>
                                <th scope="col">Harga</th>
                                <th scope="col">Rating</th>
                            </tr>
                        </thead>
                        <tbody id="tabel-resto-body">
                            <tr>
                                <td colSpan= {8} className="text-center">Memuat data...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    )
}
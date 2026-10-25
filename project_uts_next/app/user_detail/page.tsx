"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useEffect } from "react";
import { loadSession } from "@/script/utils";
import { onLoad } from "@/script/user-detail";

export default function UserDetail() {
    useEffect(() => {
        loadSession();
        onLoad();
    });

    return (
        <main>
            <Navbar />
            <section className="halaman-tabel">
                <h1>Daftar User</h1>
                <div className="table-wrap">
                    <table className="table table-bordered table-striped table-hover align-middle mb-0">
                        <thead>
                            <tr>
                                <th scope="col">No</th>
                                <th scope="col">Username</th>
                                <th scope="col">Email</th>
                                <th scope="col">Role</th>
                            </tr>
                        </thead>
                        <tbody id="tabel-user-body">
                            <tr>
                                <td colSpan={4} className="text-center">Memuat data...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
            <Footer />
        </main>
    )
}
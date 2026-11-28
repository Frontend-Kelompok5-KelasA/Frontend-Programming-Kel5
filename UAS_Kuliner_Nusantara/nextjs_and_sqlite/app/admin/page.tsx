"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { loadSession } from "@/script/utils";
import { onLoad } from "@/script/admin";
import MonthlyChart from "@/components/MonthlyChart";

export default function Admin() {
    const [userData, setUserData] = useState<number[]>(Array(12).fill(0));
    const [restoData, setRestoData] = useState<number[]>(Array(12).fill(0));
    const [reviewData, setReviewData] = useState<number[]>(Array(12).fill(0));

    useEffect(() => {
        loadSession();
        onLoad();

        fetch("/api/stats/monthly")
            .then((r) => r.json())
            .then((res) => {
                setUserData(res.user ?? Array(12).fill(0));
                setRestoData(res.restoran ?? Array(12).fill(0));
                setReviewData(res.review ?? Array(12).fill(0));
            })
            .catch((err) => console.error("Gagal memuat grafik:", err));
    }, []);

    return (
        <main>
            <section id="dashboard">
                <h1>Dashboard Admin</h1>

                {/* GRAFIK */}
                <div className="row g-4 mb-4">
                    <div className="col-12 col-md-4">
                        <MonthlyChart title="Jumlah User/Bulan" data={userData} />
                    </div>
                    <div className="col-12 col-md-4">
                        <MonthlyChart title="Jumlah Restoran/Bulan" data={restoData} />
                    </div>
                    <div className="col-12 col-md-4">
                        <MonthlyChart title="Jumlah Review/Bulan" data={reviewData} />
                    </div>
                </div>

                <div id="dashboard-content" className="dashboard-content row g-4">
                    <div id="card-dashboard" className="col-12 col-md-4">
                        <a href="/admin/user" className="card stat-card" data-key="user">
                            <Image src="/images/websiteEssentials/profile_icon.jpg" alt="" width={200} height={200} />
                            <div className="stat-teks">
                                <span className="stat-label">Jumlah User</span>
                                <span className="stat-number">-</span>
                            </div>         
                        </a>
                    </div>

                    <div className="card-dashboard col-12 col-md-4">
                        <a href="/admin/restaurant" className="card stat-card" data-key="restoran">
                            <Image src="/images/websiteEssentials/shop.png" alt="" width={200} height={200}/>
                            <div className="stat-teks">
                                <span className="stat-label">Jumlah Restoran</span>
                                <span className="stat-number">–</span>
                            </div> 
                        </a>
                    </div>

                    <div className="card-dashboard col-12 col-md-4">
                        <a href="/admin/reviews" className="card stat-card" data-key="review">
                            <Image src="/images/websiteEssentials/review.png" alt="" width={200} height={200}/>
                            <div className="stat-teks">
                                <span className="stat-label">Jumlah Review</span>
                                <span className="stat-number">–</span>
                            </div> 
                        </a>
                    </div>
                </div>

                <div className="col-12 d-flex flex-column justify-content-center align-items-center">
                    <br />
                    <div className="card-dashboard col-12 col-md-7 col-lg-5 col-xl-4">
                        <a href="/admin/manage-content" className="card stat-card" data-key="cms">
                            <Image src="/images/websiteEssentials/cms.png" alt="" width={200} height={200}/>
                            <div className="stat-teks">
                                <span className="stat-label">Pengaturan Konten</span>
                                <span className="stat-number">(Klik Disini)</span>
                            </div>
                        </a>
                    </div>
                </div>
            </section>
        </main>
    )
}
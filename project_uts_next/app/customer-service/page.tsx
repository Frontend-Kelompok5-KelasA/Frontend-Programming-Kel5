"use client";

import Link from "next/link";
import { useEffect } from "react";
import { loadSession } from "@/script/utils";

export default function CustomerService() {
    useEffect(() => {
        loadSession();
    }, []);

    return (
        <main>
            <div className="main-container cs-page">
                <div className="container">
                    <div className="cs-header">
                        <h1>Customer Service</h1>
                        <p className="cs-subtitle">
                            Need help recovering your password? Reach out to our support team with these options below.
                        </p>
                    </div>
                    <div className="cs-sections-wrapper">
                        <section className="cs-section-card">
                            <div className="row g-0">
                                <div className="col-12 col-lg-4 cs-card-left">
                                    <div className="cs-icon-box">
                                        <i className="bi bi-envelope-paper-fill"></i>
                                    </div>
                                </div>
                                <div className="col-12 col-lg-8 cs-card-right">
                                    <h2>Email</h2>
                                    <p className="cs-desc">
                                        Send us an email for password help and any inquiries.
                                    </p>
                                    <p className="cs-contact-text">
                                        <i className="bi bi-envelope-fill"></i> support@Kuliner-Nusantara-di-Jakarta.com
                                    </p>
                                </div>
                            </div>
                        </section>
                        <section className="cs-section-card">
                            <div className="row g-0">
                                <div className="col-12 col-lg-4 cs-card-left">
                                    <div className="cs-icon-box">
                                        <i className="bi bi-telephone-inbound-fill"></i>
                                    </div>
                                </div>
                                <div className="col-12 col-lg-8 cs-card-right">
                                    <h2>Phone Number</h2>
                                    <p className="cs-desc">
                                        Call our customer service staff for direct assistance.
                                    </p>
                                    <p className="cs-contact-text">
                                        <i className="bi bi-telephone-fill"></i> +62 101-0011-1110
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                    <div className="cs-back-wrap">
                        <Link href="/login" className="cs-back-btn">
                            <i className="bi bi-arrow-left"></i> Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
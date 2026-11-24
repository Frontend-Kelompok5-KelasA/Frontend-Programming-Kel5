"use client";

import { useEffect } from "react";
import Image from "next/image";
import { loadSession } from "@/script/utils";

export default function AboutUs() {
  useEffect(() => {
    loadSession();
  }, []);

  const teamMembers = [
    { name: "Gabriella Geraldine", nim: "535250023" },
    { name: "Reyhan Janstephen", nim: "535250034" },
    { name: "Monica Irene", nim: "535250041" },
    { name: "Natanael Gunawan", nim: "535250046" },
    { name: "Moses Marvian Arsata", nim: "535250050" },
  ];

  return (
    <main>
      <div className="main-container about-page">
        <section className="about-hero">
          <div className="container">
            <Image src="/images/websiteEssentials/logo.png" alt="Logo" width={110} height={110} className="about-logo"/>
            <h1>Tentang Kuliner Nusantara</h1>
          </div>
        </section>
        <div className="container my-5">
          <div className="about-card mb-5">
            <p>
              Website Kuliner Nusantara di Jakarta adalah proyek Ujian Akhir Semester mata kuliah Frontend Programming yang dikembangkan oleh kami Kelompok 5.
            </p>
          </div>

          <section className="team-section">
            <h2>Kelompok 5</h2>
            <div className="row g-4 justify-content-center mt-2">
              {teamMembers.map((member, idx) => (
                <div key={idx} className="col-12 col-sm-6 col-lg-4">
                  <div className="member-card">
                    <div className="member-avatar">
                      <i className="bi bi-person-fill"></i>
                    </div>
                    <h3>{member.name}</h3>
                    <span className="member-nim">{member.nim}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
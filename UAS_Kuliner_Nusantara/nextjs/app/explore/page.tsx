"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { loadSession } from "../../script/utils";
import { onLoad } from "../../script/explore";

export default function Home() {
  const [loading, setLoading] = useState(true);

  const load = async () => {
    loadSession();
    await onLoad();

    setTimeout(() => setLoading(false), 1000);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <main>
      <div className="main-container">
        {/* SEARCH BAR */}
        <div className="search-filter-section">
          <input type="search" id="search-rest" placeholder="Search..." />
          <button id="open-m-filter">
            Filter
            <Image
              src="/images/websiteEssentials/filter.png"
              alt="logo filter"
              width={100}
              height={100}
            />
          </button>

          {/* MODAL FILTER */}
          <div id="modal">
            <div className="modal-inner">
              <button id="cancel-filter" aria-label="Tutup">
                &times;
              </button>
              <h1>Filter Your Restaurant!</h1>
              <h2>Asal Daerah Nusantara</h2>
              <div id="asal-daerah-filter"></div>
              <hr />
              <h2>Jenis Makanan</h2>
              <div id="jenis-filter"></div>
              <hr />
              <h2>Price Range</h2>
              <div id="price-filter"></div>
              <hr />
              <button id="close-filter">Done</button>
            </div>
          </div>
        </div>

        <button id="matiin-filter">Cancel Filter</button>

        <div className="list-resto" id="halal-section">
          <div className="header-halal">
            <h2>Halal Food With Most Rating</h2>
            <Image
              src="/images/websiteEssentials/logo_halal.jpg"
              alt="logo halal"
              width={100}
              height={100}
            />
          </div>
          <div
            className="food-list d-flex flex-wrap justify-content-center gap-4"
            id="halal-list"
          />
        </div>

        <hr />

        <div className="list-resto">
          <h2>Explore Some Restaurant</h2>
          {loading ? <p> Loading... </p> : null}
          <div
            className="food-list d-flex flex-wrap justify-content-center gap-4"
            id="food-list"
          >
            {/* Card di-generate otomatis dari /api/resto lewat script.js */}
          </div>
        </div>
      </div>

      <div id="detail-modal">
        <div className="modal-inner detail-inner">
          <button id="close-detail" aria-label="Tutup">
            &times;
          </button>
          <div id="detail-content">
            {loading ? <p> Loading... </p> : null}
            {/* Modal detail restoran diisi di script.js) */}
          </div>
        </div>
      </div>
    </main>
  );
}
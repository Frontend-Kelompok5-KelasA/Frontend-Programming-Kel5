"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { loadSession } from "@/script/utils";
import { onLoad } from "@/script/explore";

export default function Home() {
  const [loading, setLoading] = useState(true);

  const refs = useRef<any>({
    filter: {
      input: null,
      "button-text": null,
      "button-image": null,
      "menu-title": null,
      "menu-regions": null,
      "menu-types": null,
      "menu-prices": null,
      "menu-done": null,
      cancel: null,
    },
    explore: {
      title: null,
      halal: null,
    },
  });

  const [filterText, setFilterText] = useState("");

  const load = async () => {
    loadSession();
    await onLoad(refs.current, { filterText: setFilterText });

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
          <input
            type="search"
            id="search-rest"
            placeholder=""
            ref={(e) => {
              refs.current.filter.input = e;
            }}
          />
          <button id="open-m-filter">
            {filterText}
            <Image
              src="/images/websiteEssentials/filter.png"
              alt="logo filter"
              width={100}
              height={100}
              ref={(e) => {
                refs.current.filter["button-image"] = e;
              }}
            />
          </button>

          {/* MODAL FILTER */}
          <div id="modal">
            <div className="modal-inner">
              {loading ? <p> Loading... </p> : null}
              <button id="cancel-filter" aria-label="Tutup">
                &times;
              </button>
              <h1
                ref={(e) => {
                  refs.current.filter["menu-title"] = e;
                }}
              />
              <h2
                ref={(e) => {
                  refs.current.filter["menu-regions"] = e;
                }}
              />
              <div id="asal-daerah-filter"></div>
              <hr />
              <h2
                ref={(e) => {
                  refs.current.filter["menu-types"] = e;
                }}
              />
              <div id="jenis-filter"></div>
              <hr />
              <h2
                ref={(e) => {
                  refs.current.filter["menu-prices"] = e;
                }}
              />
              <div id="price-filter"></div>
              <hr />
              <button
                id="close-filter"
                ref={(e) => {
                  refs.current.filter["menu-done"] = e;
                }}
              />
            </div>
          </div>
        </div>

        <button
          id="matiin-filter"
          ref={(e) => {
            refs.current.filter.cancel = e;
          }}
        />

        <div className="list-resto" id="halal-section">
          <div className="header-halal">
            <h2
              ref={(e) => {
                refs.current.explore.halal = e;
              }}
            />
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
          {loading ? <p> Loading... </p> : null}
          <h2
            ref={(e) => {
              refs.current.explore.title = e;
            }}
          />
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

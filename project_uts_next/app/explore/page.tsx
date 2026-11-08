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
            button: {
                text: null,
                image: null
            },
            menu: {
                title: null,
                regions: null,
                types: null,
                prices: null,
                done: null
            }
        },
        title: null
    });

    const [filterText, setFilterText] = useState("");

    const load = async() => {
        await loadSession();
        await onLoad(refs.current, {filterText: setFilterText});

        setTimeout(() => setLoading(false), 1000);
    };

    useEffect(() => {
        load();
    }, []);

    return (
        <main className={loading ? "d-none" : ""}>
            <div className="main-container">
                {/* search bar */}
                <div className="search-filter-section">
                    <input type="search"
                           id="search-rest"
                           placeholder=""
                           ref={(e) => {
                               refs.current.filter.input = e;
                           }}
                    />
                    <button id="open-m-filter">
                        {filterText}
                        <Image src="/images/websiteEssentials/filter.png"
                               alt="logo filter"
                               width={100}
                               height={100}
                               ref={(e) => {
                                   refs.current.filter.button.image = e;
                               }}
                        />
                    </button>

                    <div id="modal">
                        <div className="modal-inner">
                            <button id="cancel-filter" aria-label="Tutup">&times;</button>
                            <h1 ref={(e) => {
                                refs.current.filter.menu.title = e;
                            }} />
                            <h2 ref={(e) => {
                                refs.current.filter.menu.regions = e;
                            }} />
                            <div id="asal-daerah-filter"></div>
                            <hr />
                            <h2 ref={(e) => {
                                refs.current.filter.menu.types = e;
                            }} />
                            <div id="jenis-filter"></div>
                            <hr />
                            <h2 ref={(e) => {
                                refs.current.filter.menu.prices = e;
                            }} />
                            <div id="price-filter"></div>
                            <hr />
                            <button id="close-filter" ref={(e) => {
                                refs.current.filter.menu.done = e;
                            }} />
                        </div>
                    </div>
                </div>

                <button id="matiin-filter" ref={(e) => {
                    refs.current.filter.cancel = e;
                }} />

                <hr />

                <div className="list-resto">
                    <h2 ref={(e) => {
                        refs.current.title = e;
                    }} />
                    <div className="food-list d-flex flex-wrap justify-content-center gap-4" id="food-list">
                        {/* Card di-generate otomatis dari /api/resto lewat script.js */}
                    </div>
                </div>
            </div>

            <div id="detail-modal">
                <div className="modal-inner detail-inner">
                    <button id="close-detail" aria-label="Tutup">&times;</button>
                    <div id="detail-content">
                        {/* Modal detail restoran diisi di script.js) */}
                    </div>
                    </div>
            </div>
        </main>
    );
}
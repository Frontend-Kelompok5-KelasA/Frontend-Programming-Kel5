"use client";

import { esc } from "@/script/utils";

declare const bootstrap: any;

export async function onLoad(){
    const foodList = document.getElementById("food-list");
    const popularList = document.getElementById("popular-list");
    const searchInput = document.getElementById("search-rest");
    let resizeTimer: NodeJS.Timeout;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(bangunCarousel, 150);
    });
    const gambar_def = "migor.png";

    const CARD_WIDTH = 288;
    const CARD_GAP = 24;
    const ROW_PADDING = 32;
    let currentUser: any = null;

// 1 item itu 1 restoran (semua lokasi/cabangnya ada di item.location)
    interface GabunganResto {
        key: string,
        name: string,
        desc: string,
        image: string,
        cat: string,
        tag: string,
        status: string,
        official_website: string,
        instagram: string,
        locations: {
            id: string,
            city: string,
            place: string,
            open_hour: string,
            rating: number,
            price: string,
            harga: {
                min: number,
                max: number
            }
        }[]
    }

    let gabunganResto: GabunganResto[] = [];
    let popularCards: HTMLElement[]|Element[] = [];
    let perSlide = 0;

    const filterTerpilih: Record<string, Set<any>> = { tag: new Set(), cat: new Set(), price: new Set() };

// pilihan range harga
    const PRICE_RANGES = [
        { label: "< Rp50.000", min: 0, max: 50000 },
        { label: "Rp50.000 - Rp100.000", min: 50000, max: 100000 },
        { label: "> Rp100.000", min: 100000, max: Infinity }
    ];

// "50.000-75.000" -> { min: 50000, max: 75000 }, kalau kosong -> null
    function parseHarga(str: string) {
        if (!str) return null;
        const angka = str.split("-").map(
            (s: string) => parseInt(s.replace(/\./g, ""), 10)
        );
        if (angka.some(isNaN)) return null;
        return { min: angka[0], max: angka[angka.length - 1] };
    }

// rata-rata rating dari semua cabang
    function rataRating(resto: Record<string, any>) {
        const r = resto.locations
            .map((l: Record<string, string|number>) => l.rating)
            .filter((x: any) => typeof x === "number"
        );
        if (r.length === 0) return 0;
        return Math.round(
            (r.reduce((a: number, b: number) => a + b, 0) / r.length) * 100
        ) / 100;
    }

// menggabungkan data yang namanya sama jadi 1 card dengan banyak lokasi
    function gabungCabangResto(restos: Record<string, any>[]) {
        const map = new Map();

        restos.forEach((r: Record<string, any>) => {
            const key = r.name.trim().toLowerCase();

            if (!map.has(key)) {
                map.set(key, {
                    key: key,
                    name: r.name.trim(),
                    desc: r.desc,
                    image: r.image,
                    cat: r.cat,
                    tag: r.tag,
                    status: r.status,
                    official_website: r.official_website,
                    instagram: r.instagram,
                    locations: []
                });
            }

            const gabungan = map.get(key);

            // kalau data pertama kosong, pakai yang lain yang terisi
            if (!gabungan.desc && r.desc) gabungan.desc = r.desc;
            if (!gabungan.image && r.image) gabungan.image = r.image;

            gabungan.locations.push({
                id: r.id,
                city: r.city,
                place: r.place,
                open_hour: r.open_hour,
                rating: r.rating,
                price: r.price,
                harga: parseHarga(r.price)
            });
        });

        return [...map.values()];
    }

    function buatTombolFilter(wadah: HTMLElement|null|undefined, teks: string, nilai: string|undefined|number) {
        if(!wadah || nilai == undefined)return;

        const button = document.createElement("button");

        button.className = "filter-option";
        button.textContent = teks;
        button.dataset.value = String(nilai);

        button.addEventListener("click", () => {
            button.classList.toggle("selected");
        });

        wadah.appendChild(button);
    }

// baca tombol yang sedang "selected" -> simpan ke filterTerpilih
    function simpanFilter() {
        const baca = (id: string, himpunan: Set<string|number>, ubah: any) => {
            himpunan.clear();
            document.querySelectorAll(`#${id} .filter-option.selected`)
                // @ts-ignore
                .forEach((b: Element) => himpunan.add(ubah(b.dataset.value)));
        };

        baca("asal-daerah-filter", filterTerpilih.tag, String);
        baca("jenis-filter", filterTerpilih.cat, String);
        baca("price-filter", filterTerpilih.price, Number);
    }

// kembalikan tampilan tombol sesuai filter yang terakhir diterapkan (dipakai saat batal)
    function pulihkanTombol() {
        const grup: [string, Set<any>, typeof String | typeof Number][] = [
            ["asal-daerah-filter", filterTerpilih.tag, String],
            ["jenis-filter", filterTerpilih.cat, String],
            ["price-filter", filterTerpilih.price, Number]
        ];

        grup.forEach(([id, himpunan, ubah]) => {
            document.querySelectorAll(`#${id} .filter-option`).forEach((b) => {
                // @ts-ignore
                b.classList.toggle("selected", himpunan.has(ubah(b.dataset.value)));
            });
        });
    }



    if (foodList || popularList) {
        // ambil data dari /api/resto
        fetch("../api/resto")
            .then((response) => response.json())
            .then((restos) => {
                gabunganResto = gabungCabangResto(restos);

                renderExploreCarousel(restos);

                // index.html nampilin popular dishes
                if (popularList) renderPopular();

                // explore.html nampilin semua resto & tombol filter
                if (foodList) {
                    renderFoodCards(gabunganResto);

                    const tagFilter = document.getElementById("asal-daerah-filter");
                    const catFilter = document.getElementById("jenis-filter");
                    const priceFilter = document.getElementById("price-filter");

                    const tag = [...new Set(
                        restos.map((resto: Record<string, any>) => resto.tag)
                    )];
                    const cat = [...new Set(
                        restos.map((resto: Record<string, any>) => resto.cat))
                    ];

                    tag.forEach((daerah: any) => buatTombolFilter(tagFilter, daerah, daerah));
                    cat.forEach((jenis: any) => buatTombolFilter(catFilter, jenis, jenis));
                    PRICE_RANGES.forEach(
                        (range, i) => buatTombolFilter(priceFilter, range.label, i)
                    );
                }
            })
            .catch((error) => console.error("Failed fetching /api/resto:", error));
    }

// gabungan search dan semua filter
// dalam 1 kelompok = OR (boleh pilih beberapa), antar kelompok = AND
    function terapkanFilter() {
        // @ts-ignore
        const keyword = searchInput ? searchInput.value.trim().toLowerCase() : "";

        const hasil = gabunganResto.filter((resto) => {
            const cocokNama = String(resto.name).toLowerCase().includes(keyword);
            const cocokTag = filterTerpilih.tag.size === 0 || filterTerpilih.tag.has(resto.tag);
            const cocokCat = filterTerpilih.cat.size === 0 || filterTerpilih.cat.has(resto.cat);

            // cocok kalau ADA cabang yang harganya beririsan dengan range yang dipilih
            const cocokHarga = filterTerpilih.price.size === 0 ||
                resto.locations.some((loc) => {
                    if (!loc.harga) return false;
                    return [...filterTerpilih.price].some((i) => {
                        const range = PRICE_RANGES[i];
                        return loc.harga.min < range.max && loc.harga.max > range.min;
                    });
                }
            );

            return cocokNama && cocokTag && cocokCat && cocokHarga;
        });

        renderFoodCards(hasil);
    }

// index.html nampilin 12 resto dengan rata-rata rating >= 4.4, urut dari tertinggi
    function renderPopular() {
        const populer = gabunganResto
            .map((resto) => ({ ...resto, rataRating: rataRating(resto) }))
            .filter((resto) => resto.rataRating >= 4.4)
            .sort((a, b) => b.rataRating - a.rataRating)
            .slice(0, 12);

        const temp = document.createElement("div");
        renderFoodCards(populer, temp, true);
        popularCards = [...temp.querySelectorAll(".card")];

        if(popularList && popularCards.length === 0){
            popularList.innerHTML = temp.innerHTML;
            return;
        }

        perSlide = 0;
        bangunCarousel();
    }

// untuk carousel pada bagian explore
    function renderExploreCarousel(restos: Record<string, any>[]) {
        const carousel = document.getElementById("explore-carousel");
        if (!carousel) return;

        const inner = carousel.querySelector(".carousel-inner");

        const gambarUnik = [...new Set(restos.map((r) => r.image).filter(Boolean))];
        if (gambarUnik.length === 0) return; // slide statis di HTML tetap dipakai

        for (let i = gambarUnik.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [gambarUnik[i], gambarUnik[j]] = [gambarUnik[j], gambarUnik[i]];
        }

        const dipilih = gambarUnik.slice(0, 12);

        if(inner){
            inner.innerHTML = dipilih.map((g, i) => `
                <div class="carousel-item ${i === 0 ? "active" : ""}">
                    <img src="/images/${g}" alt="Kuliner Nusantara" loading="lazy">
                </div>
            `).join("");

            inner.innerHTML = gambarUnik.map((g, i) => `
                <div class="carousel-item ${i === 0 ? "active" : ""}">
                    <img src="/images/${g}" alt="Kuliner Nusantara" loading="lazy">
                </div>
            `).join("");
        }

        bootstrap.Carousel.getOrCreateInstance(carousel);
    }

// bangun carousel untuk bagian popular food
    function bangunCarousel() {
        const carousel = document.getElementById("popular-carousel");
        const prev = document.getElementById("popular-prev");
        const next = document.getElementById("popular-next");
        if (!carousel || popularCards.length === 0) return;

        const tersedia = carousel.clientWidth - ROW_PADDING;
        const n = Math.max(1, Math.floor((tersedia + CARD_GAP) / (CARD_WIDTH + CARD_GAP)));

        if (n === perSlide) return;
        perSlide = n;

        if(popularList)popularList.innerHTML = "";

        for (let i = 0; i < popularCards.length; i += n) {
            const item = document.createElement("div");
            item.className = "carousel-item" + (i === 0 ? " active" : "");

            const row = document.createElement("div");
            row.className = "popular-row";
            row.append(...popularCards.slice(i, i + n));

            item.appendChild(row);
            if(popularList)popularList.appendChild(item);
        }

        const adaBanyakSlide = popularCards.length > n;
        if(prev)prev.classList.toggle("d-none", !adaBanyakSlide);
        if(next)next.classList.toggle("d-none", !adaBanyakSlide);
    }

    function renderFoodCards(restos: GabunganResto[], target = foodList, tampilRating = false) {
        if(target)target.innerHTML = "";

        // kalau alfabet restoran tidak ada yang sama dengan nama resto, resto tidak ditemukan
        if (target && restos.length === 0) {
            target.innerHTML = '<p class="no-result">Restoran tidak ditemukan.</p>';
            return;
        }

        restos.forEach((resto) => {
            const imageFile = resto.image ? resto.image : gambar_def;
            const firstLoc = resto.locations[0];
            const extra = resto.locations.length - 1;

            const card = document.createElement("div");
            card.className = "card";
            card.style.width = CARD_WIDTH + "px";

            card.innerHTML = `
                <img src="images/${imageFile}" class="card-img-top" alt="${resto.name}">
                <div class="card-body">
                    <h5 class="card-title">${resto.name}</h5>
                    <p class="card-text">${resto.desc}</p>
                    <p class="card-loc">📍 ${firstLoc.city || "-"}${extra > 0 ? ` <small>(+${extra} cabang lain)</small>` : ""}</p>
                    <button class="but-card" data-key="${resto.key}">Lihat Detail</button>
                </div>
            `;

            if(target)target.appendChild(card);
        });
    }

// search case insensitive, langsung diload pas mengetik
    if (searchInput) {
        searchInput.addEventListener("input", terapkanFilter);
    }

// bikin modal buat detail resto, isinya ada semua lokasi
    const detailModal = document.getElementById("detail-modal");
    const detailContent = document.getElementById("detail-content");

    function openDetail(key: string) {
        const resto = gabunganResto.find((r) => r.key === key);
        if (!resto) return;

        const imageFile = resto.image ? resto.image : gambar_def;

        const lokasiHTML = resto.locations.map((loc) => `
            <li class="loc-item">
                <strong>${loc.city || "-"}</strong>
                <span>${loc.place}</span>
                <span>🕒 ${loc.open_hour}</span>
                ${loc.rating ? `<span>⭐ ${loc.rating}</span>` : ""}
            </li>
        `).join("");

        const links = [
            resto.official_website ? `<a href="${resto.official_website}" target="_blank" rel="noopener">
            <img class="web" src="images/web.avif" alt="website">Website</a>` : "",
            resto.instagram ? `<a href="${resto.instagram}" target="_blank" rel="noopener">
            <img class="ig" src="images/instagram.webp" alt="instagram">Instagram</a>` : ""
        ].join(" ");

        const reviewHTML = currentUser ? `
            <h3>Tulis Review</h3>
            <form id="review-form" class="review-form d-flex flex-column gap-2">
                <select name="restaurant_id" required>
                    ${resto.locations.map((l) =>
                `<option value="${esc(l.id)}">${esc(l.city)} - ${esc(l.place?.slice(0, 50))}</option>`
            ).join("")}
                </select>
                <select name="rating" required>
                    <option value="">Pilih rating</option>
                    <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                    <option value="4">⭐⭐⭐⭐ (4)</option>
                    <option value="3">⭐⭐⭐ (3)</option>
                    <option value="2">⭐⭐ (2)</option>
                    <option value="1">⭐ (1)</option>
                </select>
                <textarea name="comment" rows="3" maxlength="1000" placeholder="Ceritakan pengalamanmu..." required></textarea>
                <button type="submit">Kirim Review</button>
                <p id="review-msg"></p>
            </form>`
            : `<p><a href="/login">Login</a> untuk menulis review.</p>`;

        if(detailContent)detailContent.innerHTML = `
            <img src="images/${imageFile}" alt="${resto.name}" class="detail-img">
            <h2>${resto.name}</h2>
            <p>${resto.tag} · ${resto.cat} · ${resto.status}</p>
            ${resto.desc ? `<p>${resto.desc}</p>` : ""}
            <h3>Lokasi (${resto.locations.length})</h3>
            <ul class="loc-list">${lokasiHTML}</ul>
            <div class="detail-links">${links}</div>
            ${reviewHTML}
        `;

        detailModal?.classList.add("open");
    }

    function closeDetail() {
        detailModal?.classList.remove("open");
    }

    if (foodList && detailModal) {
        // event delegation: 1 listener untuk semua tombol "Lihat Detail"
        foodList.addEventListener("click", (e: PointerEvent) => {
            // @ts-ignore
            const btn = e.target?.closest(".but-card");
            if (btn) openDetail(btn.dataset.key);
        });

        document.getElementById("close-detail")?.addEventListener("click", closeDetail);

        // klik area gelap di luar kotak = tutup
        detailModal.addEventListener("click", (e) => {
            if (e.target === detailModal) closeDetail();
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") closeDetail();
        });

        detailContent?.addEventListener("submit", async (e) => {
            // @ts-ignore
            if (e.target?.id !== "review-form") return;
            e.preventDefault();

            const form = e.target;

            // @ts-ignore
            const msg = form?.querySelector("#review-msg");

            // @ts-ignore
            const body = Object.fromEntries(new FormData(form));

            try {
                const res = await fetch("/api/reviews", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Gagal mengirim review.");

                msg.textContent = "Terima kasih! Review kamu sudah terkirim.";

                // @ts-ignore
                form.reset();
            } catch (err) {
                // @ts-ignore
                msg.textContent = err?.message;
            }
        });
    }

// index.html: tombol "Lihat Detail" di Popular Dishes mengarah ke halaman explore
    if (popularList) {
        popularList.addEventListener("click", (e) => {
            // @ts-ignore
            if (e.target?.closest(".but-card")) window.location.href = "explore.html";
        });
    }

    const openMdl = document.getElementById("open-m-filter");
    const closeMdl = document.getElementById("close-filter");
    const cancelFilter = document.getElementById("cancel-filter");
    const modal = document.getElementById("modal");
    const resetFilter = document.getElementById("matiin-filter");

// tombol matiin filter bakal muncul kalau ada filter yang aktif
    function updateTombolReset() {
        if (!resetFilter) return;

        const aktif = filterTerpilih.tag.size + filterTerpilih.cat.size + filterTerpilih.price.size > 0;
        resetFilter.classList.toggle("show", aktif);
    }

    if (resetFilter) {
        resetFilter.addEventListener("click", () => {
            // hapus semua pilihan filter (search tetap)
            document.querySelectorAll(".filter-option.selected")
                .forEach((b) => b.classList.remove("selected"));

            simpanFilter();
            terapkanFilter();
            updateTombolReset();
        });
    }

    if (openMdl && closeMdl && modal) {
        openMdl.addEventListener("click", () => {
            modal.classList.add("open");
        });

        closeMdl.addEventListener("click", () => {
            simpanFilter();
            terapkanFilter();
            updateTombolReset();
            modal.classList.remove("open");
        });

        if (cancelFilter) {
            cancelFilter.addEventListener("click", () => {
                pulihkanTombol();
                modal.classList.remove("open");
            });
        }
    }
}
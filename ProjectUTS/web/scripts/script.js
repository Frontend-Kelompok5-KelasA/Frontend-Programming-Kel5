document.addEventListener("DOMContentLoaded", function () {

    const hamburger = document.getElementById("nav-hamburger");
    const navLinks = document.getElementById("nav-links");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

    function redirectButton(id, page) {
        const button = document.querySelector(id);

        if (button) {
            button.addEventListener("click", function () {
                window.location.href = page;
            });
        }
    }

    redirectButton("#tombol-explore-food", "explore.html");
    redirectButton("#profile-button", "login.html");

    const navBack = document.querySelector("#nav-back");

    if (navBack) {
        navBack.addEventListener("click", function () {
            window.history.back();
        });
    }

    // explore.html
    const foodList = document.getElementById("food-list");
    const popularList = document.getElementById("popular-list");
    const searchInput = document.getElementById("search-rest");
    const gambar_def = "migor.png";

    // 1 item itu 1 restoran (semua lokasi/cabangnya ada di item.location)
    let gabunganResto = [];

    const filterTerpilih = { tag: new Set(), cat: new Set(), price: new Set() };

    // pilihan range harga
    const PRICE_RANGES = [
        { label: "< Rp50.000", min: 0, max: 50000 },
        { label: "Rp50.000 - Rp100.000", min: 50000, max: 100000 },
        { label: "> Rp100.000", min: 100000, max: Infinity }
    ];

    // "50.000-75.000" -> { min: 50000, max: 75000 }, kalau kosong -> null
    function parseHarga(str) {
        if (!str) return null;
        const angka = str.split("-").map((s) => parseInt(s.replace(/\./g, ""), 10));
        if (angka.some(isNaN)) return null;
        return { min: angka[0], max: angka[angka.length - 1] };
    }

    // rata-rata rating dari semua cabang
    function rataRating(resto) {
        const r = resto.locations.map((l) => l.rating).filter((x) => typeof x === "number");
        if (r.length === 0) return 0;
        return Math.round((r.reduce((a, b) => a + b, 0) / r.length) * 100) / 100;
    }

    // menggabungkan data yang namanya sama jadi 1 card dengan banyak lokasi
    function gabungCabangResto(restos) {
        const map = new Map();

        restos.forEach((r) => {
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

    function buatTombolFilter(wadah, teks, nilai) {
        const button = document.createElement("button");

        button.className = "filter-option";
        button.textContent = teks;
        button.dataset.value = nilai;

        button.addEventListener("click", () => {
            button.classList.toggle("selected");
        });

        wadah.appendChild(button);
    }

    // baca tombol yang sedang "selected" -> simpan ke filterTerpilih
    function simpanFilter() {
        const baca = (id, himpunan, ubah) => {
            himpunan.clear();
            document.querySelectorAll(`#${id} .filter-option.selected`)
                .forEach((b) => himpunan.add(ubah(b.dataset.value)));
        };

        baca("asal-daerah-filter", filterTerpilih.tag, String);
        baca("jenis-filter", filterTerpilih.cat, String);
        baca("price-filter", filterTerpilih.price, Number);
    }

    // kembalikan tampilan tombol sesuai filter yang terakhir diterapkan (dipakai saat batal)
    function pulihkanTombol() {
        const grup = [
            ["asal-daerah-filter", filterTerpilih.tag, String],
            ["jenis-filter", filterTerpilih.cat, String],
            ["price-filter", filterTerpilih.price, Number]
        ];

        grup.forEach(([id, himpunan, ubah]) => {
            document.querySelectorAll(`#${id} .filter-option`).forEach((b) => {
                b.classList.toggle("selected", himpunan.has(ubah(b.dataset.value)));
            });
        });
    }



    if (foodList || popularList) {
        // ambil data dari data.json
        fetch("../api/resto")
            .then((response) => response.json())
            .then((restos) => {
                gabunganResto = gabungCabangResto(restos);

                // index.html nampilin popular dishes
                if (popularList) renderPopular();
 
                // explore.html nampilin semua resto & tombol filter
                if (foodList) {
                    renderFoodCards(gabunganResto);

                    const tagFilter = document.getElementById("asal-daerah-filter");
                    const catFilter = document.getElementById("jenis-filter");
                    const priceFilter = document.getElementById("price-filter");

                    const tag = [...new Set(restos.map((resto) => resto.tag))];
                    const cat = [...new Set(restos.map((resto) => resto.cat))];

                    tag.forEach((daerah) => buatTombolFilter(tagFilter, daerah, daerah));
                    cat.forEach((jenis) => buatTombolFilter(catFilter, jenis, jenis));
                    PRICE_RANGES.forEach((range, i) => buatTombolFilter(priceFilter, range.label, i));
                }
            })
            .catch((error) => console.error("Failed fetching data.json:", error));
    }

    // gabungan search dan semua filter
    // dalam 1 kelompok = OR (boleh pilih beberapa), antar kelompok = AND
    function terapkanFilter() {
        const keyword = searchInput ? searchInput.value.trim().toLowerCase() : "";
 
        const hasil = gabunganResto.filter((resto) => {
            const cocokNama = resto.name.toLowerCase().includes(keyword);
            const cocokTag = filterTerpilih.tag.size === 0 || filterTerpilih.tag.has(resto.tag);
            const cocokCat = filterTerpilih.cat.size === 0 || filterTerpilih.cat.has(resto.cat);
 
            // cocok kalau ADA cabang yang harganya beririsan dengan range yang dipilih
            const cocokHarga = filterTerpilih.price.size === 0 || resto.locations.some((loc) => {
                if (!loc.harga) return false;
                return [...filterTerpilih.price].some((i) => {
                    const range = PRICE_RANGES[i];
                    return loc.harga.min < range.max && loc.harga.max > range.min;
                });
            });
 
            return cocokNama && cocokTag && cocokCat && cocokHarga;
        });
 
        renderFoodCards(hasil);
    }

    // index.html nampilin 5 resto dengan rata-rata rating >= 4.4, urut dari tertinggi
    function renderPopular() {
        const populer = gabunganResto
            .map((resto) => ({ ...resto, rataRating: rataRating(resto) }))
            .filter((resto) => resto.rataRating >= 4.4)
            .sort((a, b) => b.rataRating - a.rataRating)
            .slice(0, 5);
 
        renderFoodCards(populer, popularList, true);
    }

    function renderFoodCards(restos, target = foodList, tampilRating = false) {
        target.innerHTML = "";

        // kalau alfabet restoran tidak ada yang sama dengan nama resto, resto tidak ditemukan
        if (restos.length === 0) {
            target.innerHTML = '<p class="no-result">Restoran tidak ditemukan.</p>';
            return;
        }

        restos.forEach((resto) => {
            const imageFile = resto.image ? resto.image : gambar_def;
            const firstLoc = resto.locations[0];
            const extra = resto.locations.length - 1;

            const card = document.createElement("div");
            card.className = "card";
            card.style.width = "18rem";

            card.innerHTML = `
                <img src="images/${imageFile}" class="card-img-top" alt="${resto.name}">
                <div class="card-body">
                    <h5 class="card-title">${resto.name}</h5>
                    <p class="card-text">${resto.desc}</p>
                    <p class="card-loc">📍 ${firstLoc.city || "-"}${extra > 0 ? ` <small>(+${extra} cabang lain)</small>` : ""}</p>
                    <button class="but-card" data-key="${resto.key}">Lihat Detail</button>
                </div>
            `;

            target.appendChild(card);
        });
    }

    // search case insensitive, langsung diload pas mengetik
    if (searchInput) {
        searchInput.addEventListener("input", terapkanFilter);
    }

    // bikin modal buat detail resto, isinya ada semua lokasi
    const detailModal = document.getElementById("detail-modal");
    const detailContent = document.getElementById("detail-content");

    function openDetail(key) {
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

        detailContent.innerHTML = `
            <img src="images/${imageFile}" alt="${resto.name}" class="detail-img">
            <h2>${resto.name}</h2>
            <p>${resto.tag} · ${resto.cat} · ${resto.status}</p>
            ${resto.desc ? `<p>${resto.desc}</p>` : ""}
            <h3>Lokasi (${resto.locations.length})</h3>
            <ul class="loc-list">${lokasiHTML}</ul>
            <div class="detail-links">${links}</div>
        `;

        detailModal.classList.add("open");
    }

    function closeDetail() {
        detailModal.classList.remove("open");
    }

    if (foodList && detailModal) {
        // event delegation: 1 listener untuk semua tombol "Lihat Detail"
        foodList.addEventListener("click", (e) => {
            const btn = e.target.closest(".but-card");
            if (btn) openDetail(btn.dataset.key);
        });

        document.getElementById("close-detail").addEventListener("click", closeDetail);

        // klik area gelap di luar kotak = tutup
        detailModal.addEventListener("click", (e) => {
            if (e.target === detailModal) closeDetail();
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") closeDetail();
        });
    }

    // index.html: tombol "Lihat Detail" di Popular Dishes mengarah ke halaman explore
    if (popularList) {
        popularList.addEventListener("click", (e) => {
            if (e.target.closest(".but-card")) window.location.href = "explore.html";
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

    
});
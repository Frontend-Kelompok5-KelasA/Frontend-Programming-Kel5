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
                price: r.price
            });
        });

        return [...map.values()];
    }

    if (foodList) {
        // ambil data dari data.json
        fetch("data.json")
            .then((response) => response.json())
            .then((restos) => {
                gabunganResto = gabungCabangResto(restos);
                renderFoodCards(gabunganResto);

                const tagFilter = document.getElementById("asal-daerah-filter");
                const catFilter = document.getElementById("jenis-filter");

                const tag = [...new Set(restos.map((resto) => resto.tag))];
                const cat = [...new Set(restos.map((resto) => resto.cat))];

                tag.forEach((daerah) => {
                    const button = document.createElement("button");

                    button.className = "filter-option";
                    button.textContent = daerah;
                    button.dataset.value = daerah;

                    button.addEventListener("click", () => {
                        button.classList.toggle("selected");
                    });

                    tagFilter.appendChild(button);
                });
                cat.forEach((jenisMakanan) => {
                    const button = document.createElement("button");

                    button.className = "filter-option";
                    button.textContent = jenisMakanan;
                    button.dataset.value = jenisMakanan;

                    catFilter.appendChild(button);
                });
            })
            .catch((error) => console.error("Failed fetching data.json:", error));
    }

    function renderFoodCards(restos) {
        foodList.innerHTML = "";

        // kalau alfabet restoran tidak ada yang sama dengan nama resto, resto tidak ditemukan
        if (restos.length === 0) {
            foodList.innerHTML = '<p class="no-result">Restoran tidak ditemukan.</p>';
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
                    <p class="card-loc">📍 ${firstLoc.city || "-"}${extra > 0 ? ` <small>(+${extra} lokasi lain)</small>` : ""}</p>
                    <button class="but-card" data-key="${resto.key}">Liat Detail</button>
                </div>
            `;

            foodList.appendChild(card);
        });
    }

    // search case insensitive, langsung diload pas mengetik
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const keyword = searchInput.value.trim().toLowerCase();

            const hasil = gabunganResto.filter((resto) =>
                resto.name.toLowerCase().includes(keyword)
            );

            renderFoodCards(hasil);
        });
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
            resto.official_website ? `<a href="${resto.official_website}" target="_blank" rel="noopener">Website</a>` : "",
            resto.instagram ? `<a href="${resto.instagram}" target="_blank" rel="noopener">Instagram</a>` : ""
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
        // event delegation: 1 listener untuk semua tombol "Liat Detail"
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

    const openMdl = document.getElementById("open-m-filter");
    const closeMdl = document.getElementById("close-filter");
    const modal = document.getElementById("modal");

    if (openMdl && closeMdl && modal) {
        openMdl.addEventListener("click", () => {
            modal.classList.add("open");
        });

        closeMdl.addEventListener("click", () => {
            modal.classList.remove("open");
        });
    }

    

});
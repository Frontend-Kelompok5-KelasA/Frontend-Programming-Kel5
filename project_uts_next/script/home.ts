"use client";

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

    function renderPopular() {
        const populer = gabunganResto
            .map((resto) => ({ ...resto, rataRating: rataRating(resto) }))
            .filter((resto) => resto.rataRating >= 4.4)
            .sort((a, b) => b.rataRating - a.rataRating)
            .slice(0, 12);

        console.log(gabunganResto);

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

    if (popularList) {
        fetch("/api/resto")
        .then((response) => response.json())
        .then((restos) => {
            gabunganResto = gabungCabangResto(restos);

            // index.html nampilin popular dishes
            if (popularList) renderPopular();
        })
        .catch((error) => console.error("Failed fetching /api/resto:", error));
    }
}
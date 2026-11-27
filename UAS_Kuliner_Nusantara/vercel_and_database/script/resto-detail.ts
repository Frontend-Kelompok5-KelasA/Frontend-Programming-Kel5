import { hapusData } from "./utils";

import { redirect } from "next/navigation";

export async function onLoad() {
  const loadRestTable = async () => {
    const tbody = document.getElementById("tabel-resto-body");
    if (!tbody) return;

    try {
      const res = await fetch("/api/resto");
      if (!res.ok) throw new Error("Gagal mengambil data resto");

      const restos = await res.json();

      if (restos.length === 0) {
        tbody.innerHTML =
          '<tr><td colspan="8" class="text-center">Belum ada restoran.</td></tr>';
        return;
      }

      tbody.innerHTML = "";

      restos.forEach((resto: Record<string, string>, i: number) => {
        const baris = document.createElement("tr");

        const makeCell = (isi: string) => {
          const td = document.createElement("td");
          td.textContent = isi ?? "-";
          return td;
        };

        const potong = (teks: string, maks = 45) =>
          teks && teks.length > maks ? teks.slice(0, maks) + "…" : teks;

        baris.appendChild(makeCell(String(i + 1)));
        baris.appendChild(makeCell(resto.name));
        baris.appendChild(makeCell(resto.city));
        baris.appendChild(makeCell(potong(resto.place)));
        baris.appendChild(makeCell(resto.cat));
        baris.appendChild(makeCell(resto.status));
        baris.appendChild(makeCell(resto.price));
        baris.appendChild(makeCell(resto.rating));

        const button = document.createElement("button");
        button.textContent = "Edit";
        button.className = "btn-hapus-dan-edit";
        button.addEventListener("click", () => {
          redirect(`/restaurant/edit/${resto.id}`);
        });

        const td = document.createElement("td");
        td.appendChild(button);

        baris.appendChild(td);

        const tombolHapus = document.createElement("button");
        tombolHapus.type = "button";
        tombolHapus.textContent = "Hapus";
        tombolHapus.className = "btn-hapus-dan-edit";
        tombolHapus.addEventListener("click", async () => {
          const berhasil = await hapusData(
            `/api/resto/${encodeURIComponent(resto.id)}`,
            `Hapus restoran "${resto.name}"? Semua review restoran ini juga ikut terhapus dan tidak bisa dibatalkan.`,
          );
          if (berhasil) await loadRestTable();
        });

        const tdHapus = document.createElement("td");
        tdHapus.appendChild(tombolHapus);
        baris.appendChild(tdHapus);

        tbody.appendChild(baris);
      });
    } catch (err) {
      console.error("Gagal memuat tabel resto:", err);
      tbody.innerHTML =
        '<tr><td colspan="8" class="text-center">Gagal memuat data.</td></tr>';
    }
  };

  await loadRestTable();
}

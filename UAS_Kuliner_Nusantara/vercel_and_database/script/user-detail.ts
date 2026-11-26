import { hapusData } from "./utils";

export async function onLoad() {
  const loadUserTable = async () => {
    const tbody = document.getElementById("tabel-user-body");
    if (!tbody) return;

    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Gagal mengambil data user");

      const users = await res.json();

      if (users.length === 0) {
        tbody.innerHTML =
          '<tr><td colspan="4" class="text-center">Belum ada user</td></tr>';
        return;
      }

      tbody.innerHTML = "";

      users.forEach((user: Record<string, string>, i: number) => {
        const baris = document.createElement("tr");

        const makeCell = (isi: string, kelas = "") => {
          const td = document.createElement("td");
          if (kelas) td.className = kelas;
          td.textContent = isi;
          return td;
        };

        baris.appendChild(makeCell(String(i + 1)));
        baris.appendChild(makeCell(user.username));
        baris.appendChild(makeCell(user.email));
        baris.appendChild(makeCell(user.role));

        const tombolEdit = document.createElement("button");
        tombolEdit.type = "button";
        tombolEdit.textContent = "Edit";
        tombolEdit.addEventListener("click", () => {
          window.location.href = `/edit_user/${encodeURIComponent(String(user.userId))}`;
        });

        const tdEdit = document.createElement("td");
        tdEdit.appendChild(tombolEdit);
        baris.appendChild(tdEdit);

        const tombolHapus = document.createElement("button");
        tombolHapus.type = "button";
        tombolHapus.textContent = "Hapus";
        tombolHapus.addEventListener("click", async () => {
          const berhasil = await hapusData(
            `/api/users/${encodeURIComponent(String(user.userId))}`,
            `Hapus user "${user.username}"? Review dan favorite milik user ini juga ikut terhapus dan tidak bisa dibatalkan.`,
          );
          if (berhasil) await loadUserTable();
        });

        const tdHapus = document.createElement("td");
        tdHapus.appendChild(tombolHapus);
        baris.appendChild(tdHapus);

        tbody.appendChild(baris);
      });
    } catch (err) {
      console.error("Gagal memuat tabel user", err);
      tbody.innerHTML =
        '<tr><td colspan="4" class="text-center">Gagal memuat data</td></tr>';
    }
  };

  await loadUserTable();
}

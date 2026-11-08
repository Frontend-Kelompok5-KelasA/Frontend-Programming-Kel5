export async function onLoad(){
    const loadRestTable = async () => {
        const tbody = document.getElementById('tabel-resto-body');
        if (!tbody) return;

        try {
            const res = await fetch('/api/resto');
            if (!res.ok) throw new Error('Gagal mengambil data resto');

            const restos = await res.json();

            if (restos.length === 0) {
                tbody.innerHTML = '<tr><td colspan="8" class="text-center">Belum ada restoran.</td></tr>';
                return;
            }

            tbody.innerHTML = '';

            restos.forEach((resto: Record<string, string>, i: number) => {
                const baris = document.createElement('tr');

                const makeCell = (isi: string) => {
                    const td = document.createElement('td');
                    td.textContent = isi ?? '-';
                    return td;
                };

                const potong = (teks: string, maks = 45) =>
                    teks && teks.length > maks ? teks.slice(0, maks) + '…' : teks;

                baris.appendChild(makeCell(String(i + 1)));
                baris.appendChild(makeCell(resto.name));
                baris.appendChild(makeCell(resto.city));
                baris.appendChild(makeCell(potong(resto.place)));
                baris.appendChild(makeCell(resto.cat));
                baris.appendChild(makeCell(resto.status));
                baris.appendChild(makeCell(resto.price));
                baris.appendChild(makeCell(resto.rating));

                tbody.appendChild(baris);
            });

        } catch (err) {
            console.error('Gagal memuat tabel resto:', err);
            tbody.innerHTML = '<tr><td colspan="8" class="text-center">Gagal memuat data.</td></tr>';
        }
    };

    await loadRestTable();
}
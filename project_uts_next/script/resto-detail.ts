export async function onLoad(){
    const hapusResto = async (id: string, nama: string, tombol: HTMLButtonElement) => {
        if (!confirm(`Yakin ingin menghapus "${nama}"?`)) return;

        tombol.disabled = true;
        try {
            const res = await fetch(`/api/restaurants/${encodeURIComponent(id)}`, { method: 'DELETE' });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || 'Gagal menghapus restoran');
            }
            await loadRestTable();
        } catch (err) {
            console.error(err);
            alert(err instanceof Error ? err.message : 'Gagal menghapus restoran');
            tombol.disabled = false;
        }
    };

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

                const tdAksi = document.createElement('td');
                tdAksi.className = 'text-nowrap';

                const btnEdit = document.createElement('a');
                btnEdit.href = `/edit_resto/${encodeURIComponent(resto.id)}`;
                btnEdit.className = 'btn btn-warning btn-sm me-1';
                btnEdit.textContent = 'Edit';

                const btnHapus = document.createElement('button');
                btnHapus.type = 'button';
                btnHapus.className = 'btn btn-danger btn-sm';
                btnHapus.textContent = 'Hapus';
                btnHapus.addEventListener('click', () => hapusResto(resto.id, resto.name, btnHapus));

                tdAksi.append(btnEdit, btnHapus);
                baris.appendChild(tdAksi);

                tbody.appendChild(baris);
            });

        } catch (err) {
            console.error('Gagal memuat tabel resto:', err);
            tbody.innerHTML = '<tr><td colspan="8" class="text-center">Gagal memuat data.</td></tr>';
        }
    };

    await loadRestTable();
}
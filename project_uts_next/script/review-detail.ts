export async function onLoad(){
    const loadReviewTable = async () => {
        const tbody = document.getElementById('tabel-review-body');
        if (!tbody) return;

        try {
            const res = await fetch('/api/reviews/all');
            if (!res.ok) throw new Error('Gagal mengambil data review');

            const data = await res.json();
            const reviews = Array.isArray(data) ? data : data.reviews;

            if (reviews.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="text-center">Belum ada review.</td></tr>';
                return;
            }

            tbody.innerHTML = '';

            const formatTanggal = (nilai: string) => {
                if (!nilai) return '-';
                const d = new Date(String(nilai).replace(' ', 'T'));
                if (!d) return nilai;
                return d.toLocaleDateString('id-ID', {
                    day: '2-digit', month: 'short', year: 'numeric'
                });
            };

            const potong = (teks: string, maks = 60) =>
                teks && teks.length > maks ? teks.slice(0, maks) + '…' : teks;

            reviews.forEach((r: Record<string, string>, i: number) => {
                const baris = document.createElement('tr');

                const makeCell = (isi: string) => {
                    const td = document.createElement('td');
                    td.textContent = isi ?? '-';
                    return td;
                };

                baris.appendChild(makeCell(String(i + 1)));
                baris.appendChild(makeCell(r.username));
                baris.appendChild(makeCell(formatTanggal(r.created_at)));
                baris.appendChild(makeCell(r.restaurant_name));
                baris.appendChild(makeCell(r.rating));
                baris.appendChild(makeCell(potong(r.comment)));

                tbody.appendChild(baris);
            });

        } catch (err) {
            console.error('Gagal memuat tabel review:', err);
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">Gagal memuat data.</td></tr>';
        }
    };

    await loadReviewTable();
}
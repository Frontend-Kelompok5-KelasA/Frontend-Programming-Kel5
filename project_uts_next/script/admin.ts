export async function onLoad(){
    const loadNumbers = async () => {
        const wadah = document.getElementById('dashboard-content');
        if (!wadah) return;

        try {
            const res = await fetch('/api/stats');
            if (!res.ok) throw new Error('Gagal mengambil statistik');

            const data = await res.json();
            console.log('Data statistik:', data);

            wadah.querySelectorAll('.stat-card').forEach((kartu) => {
                const angka = kartu.querySelector('.stat-number');
                if (!angka) return;

                // @ts-ignore
                const nilai = data[kartu.dataset.key] ?? 0;
                angka.textContent = Number(nilai).toLocaleString('id-ID');
            });

        } catch (err) {
            console.error('Gagal memuat statistik:', err);
        }
    };

    await loadNumbers();
}
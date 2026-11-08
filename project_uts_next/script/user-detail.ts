export async function onLoad(){
    const loadUserTable = async () => {
        const tbody = document.getElementById('tabel-user-body');
        if (!tbody) return;

        try {
            const res = await fetch('/api/users');
            if (!res.ok) throw new Error('Gagal mengambil data user');

            const users = await res.json();

            if (users.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" class="text-center">Belum ada user</td></tr>';
                return;
            }

            tbody.innerHTML = '';

            users.forEach((user: Record<string, string>, i: number) => {
                const baris = document.createElement('tr');

                const makeCell = (isi: string, kelas = '') => {
                    const td = document.createElement('td');
                    if (kelas) td.className = kelas;
                    td.textContent = isi;
                    return td;
                };

                baris.appendChild(makeCell(String(i + 1)));
                baris.appendChild(makeCell(user.username));
                baris.appendChild(makeCell(user.email));
                baris.appendChild(makeCell(user.role));

                tbody.appendChild(baris);
            });

        } catch (err) {
            console.error('Gagal memuat tabel user', err);
            tbody.innerHTML = '<tr><td colspan="4" class="text-center">Gagal memuat data</td></tr>';
        }
    };

    await loadUserTable();
}
export async function onLoad(){
    const hapusUser = async (id: string, username: string, tombol: HTMLButtonElement) => {
        if (!confirm(`Yakin ingin menghapus user "${username}"?`)) return;

        tombol.disabled = true;
        try {
            const res = await fetch(`/api/users/${encodeURIComponent(id)}`, { method: 'DELETE' });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || 'Gagal menghapus user');
            }
            await loadUserTable(); // muat ulang tabel
        } catch (err) {
            console.error(err);
            alert(err instanceof Error ? err.message : 'Gagal menghapus user');
            tombol.disabled = false;
        }
    };
    
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
                const tdAksi = document.createElement('td');
                tdAksi.className = 'text-nowrap';

                const btnEdit = document.createElement('a');
                btnEdit.href = `/edit_user/${encodeURIComponent(user.id)}`;
                btnEdit.className = 'btn btn-warning btn-sm me-1';
                btnEdit.textContent = 'Edit';

                const btnHapus = document.createElement('button');
                btnHapus.type = 'button';
                btnHapus.className = 'btn btn-danger btn-sm';
                btnHapus.textContent = 'Hapus';
                btnHapus.addEventListener('click', () => hapusUser(String(user.id), user.username, btnHapus));

                tdAksi.append(btnEdit, btnHapus);
                baris.appendChild(tdAksi);

                tbody.appendChild(baris);
            });

        } catch (err) {
            console.error('Gagal memuat tabel user', err);
            tbody.innerHTML = '<tr><td colspan="4" class="text-center">Gagal memuat data</td></tr>';
        }
    };

    await loadUserTable();
}
function requireLogin(req, res, next) {
    const u = req.session.userData;
    if (!u || !u.user_id) {
        return res.status(401).json({ error: 'Silakan login terlebih dahulu.' });
    }
    next();
}

function initReviews(app, db) {

    app.post('/api/reviews', requireLogin, (req, res) => {
        const { restaurant_id, rating, comment } = req.body;

        const nilai = Number(rating);
        if (!Number.isInteger(nilai) || nilai < 1 || nilai > 5) {
            return res.status(400).json({ error: 'Rating harus angka 1 sampai 5.' });
        }

        const teks = (comment || '').trim();
        if (!teks) return res.status(400).json({ error: 'Komentar tidak boleh kosong.' });
        if (teks.length > 1000) return res.status(400).json({ error: 'Komentar maksimal 1000 karakter.' });

        db.get('SELECT id FROM restaurant WHERE id = ?', [restaurant_id], (err, resto) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!resto) return res.status(404).json({ error: 'Restoran tidak ditemukan.' });

            db.run(
                `INSERT INTO review (user_id, restaurant_id, rating, comment, created_at)
                 VALUES (?, ?, ?, ?, datetime('now', 'localtime'))`,
                [req.session.userData.user_id, restaurant_id, nilai, teks],
                function (err) {
                    if (err) return res.status(500).json({ error: err.message });
                    res.status(201).json({ ok: true, review_id: this.lastID });
                }
            );
        });
    });

    app.get('/api/reviews', requireLogin, (req, res) => {
        const user = req.session.userData;
        const isAdmin = user.role === 'admin';

        const query = `
            SELECT rv.review_id, rv.rating, rv.comment, rv.created_at,
                   u.username, u.email,
                   rs.id AS restaurant_id, rs.name AS restaurant_name, rs.city
            FROM review rv
            LEFT JOIN user u ON u.user_id = rv.user_id
            LEFT JOIN restaurant rs ON rs.id = rv.restaurant_id
            ${isAdmin ? '' : 'WHERE rv.user_id = ?'}
            ORDER BY rv.review_id DESC`;

        db.all(query, isAdmin ? [] : [user.user_id], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ scope: isAdmin ? 'all' : 'mine', reviews: rows });
        });
    });
}

module.exports = { initReviews };

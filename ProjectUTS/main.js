const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const { initAuth } = require("./auth");
const { initReviews } = require("./reviews");

const app = express();

app.use(express.static(path.join(__dirname, 'web')))
app.use(express.static(path.join(__dirname, 'web', 'html'), {extensions: ['html']}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = new sqlite3.Database('./database.db');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'web', 'html', 'index.html'));
});

app.get('/api/resto', (req, res) => {
    const query = `SELECT id, name, city, place, description AS desc, cat, tag, status, open_hour, rating, price, official_website, instagram, image FROM restaurant`;
    
    db.all(query, [], (err, dt) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(dt);
    });
});

app.get('/api/stats', (req, res) => {
    db.get(`
        SELECT
            (SELECT COUNT(*) FROM user) AS user,
            (SELECT COUNT(*) FROM restaurant) AS restoran,
            (SELECT COUNT(*) FROM review) AS review
    `, [], (err, row) => {
        if (err) {
            console.error('SQL ERROR:', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(row);
    });
});

app.get('/api/users', (req, res) => {
    db.all(
        'SELECT user_id, email, username, role FROM user ORDER BY user_id',
        [],
        (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Terjadi kesalahan' });
            }
            res.json(rows);
        }
    );
});



initAuth(app, db);
initReviews(app, db);

app.get('/api/reviews', (req, res) => {
    db.all(`
        SELECT
            review.review_id AS id,
            user.username AS username,
            user.email AS email,
            review.created_at AS created_at,
            restaurant.name AS restaurant_name,
            restaurant.city AS city,
            review.rating AS rating,
            review.comment AS comment
        FROM review
        LEFT JOIN user ON user.user_id= review.user_id
        LEFT JOIN restaurant ON restaurant.restaurant_id = review.restaurant_id
        ORDER BY review.created_at DESC
    `, [], (err, rows) => {
        if (err) {
            console.error('SQL ERROR:', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);          // ← ARRAY langsung, tanpa scope
    });
});


app.use((req, res) => {
    res.status(404).redirect('/login');
});

app.listen(8080, () => {
    console.log('Silahkan buka http://localhost:8080 untuk mengakses website')
});


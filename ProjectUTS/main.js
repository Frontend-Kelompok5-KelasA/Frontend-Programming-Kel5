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

initAuth(app, db);
initReviews(app, db);

app.use((req, res) => {
    res.status(404).redirect('/login');
});

app.listen(8080, () => {
    console.log('Silahkan buka http://localhost:8080 untuk mengakses website')
});


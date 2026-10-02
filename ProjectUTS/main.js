const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'web')))
app.use(express.static(path.join(__dirname, 'web', 'html'), {extensions: ['html']}))
app.use(express.json());

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

app.post('/api/register', (req, res) => {
    const { email, password } = req.body;
    db.run('INSERT INTO user (email, password, role) VALUES (?, ?, ?)', [email, password, 'user'], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, user_id: this.lastID });
    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.get('SELECT * FROM user WHERE email = ? AND password = ?', [email, password], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(401).json({ error: "Invalid credentials" });
        res.json({ success: true, user });
    });
});

app.listen(8080, () => {
    console.log('Silahkan buka http://localhost:8080 untuk mengakses website')
});


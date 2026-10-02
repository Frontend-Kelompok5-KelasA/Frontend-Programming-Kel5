const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS user (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT,
        password TEXT,
        role TEXT,
        profile TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS restaurant (
        id TEXT PRIMARY KEY,
        name TEXT,
        city TEXT,
        place TEXT,
        description TEXT,
        cat TEXT,
        tag TEXT,
        status TEXT,
        open_hour TEXT,
        rating REAL,
        price TEXT,
        official_website TEXT,
        instagram TEXT,
        image TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS category (
        category_id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_name TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS restaurant_photo (
        photo_id INTEGER PRIMARY KEY AUTOINCREMENT,
        restaurant_id TEXT,
        file_path TEXT,
        FOREIGN KEY(restaurant_id) REFERENCES restaurant(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS wishlist (
        wishlist_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        restaurant_id TEXT,
        FOREIGN KEY(user_id) REFERENCES user(user_id),
        FOREIGN KEY(restaurant_id) REFERENCES restaurant(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS review (
        review_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        restaurant_id TEXT,
        rating INTEGER,
        comment TEXT,
        FOREIGN KEY(user_id) REFERENCES user(user_id),
        FOREIGN KEY(restaurant_id) REFERENCES restaurant(id)
    )`);
});

db.close(() => console.log('Empty database.'));
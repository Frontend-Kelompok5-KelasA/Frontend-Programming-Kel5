const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
const rawData = fs.readFileSync('./web/data/data.json');
const restos = JSON.parse(rawData);

db.serialize(() => {
    const stmt = db.prepare(`INSERT INTO restaurant 
        (id, name, city, place, description, cat, tag, status, open_hour, rating, price, official_website, instagram, image) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
        
    restos.forEach(r => {
        stmt.run(
            r.id, r.name, r.city, r.place, r.desc, r.cat, r.tag, r.status, 
            r.open_hour, r.rating, r.price, r.official_website, r.instagram, r.image
        );
    });

    stmt.finalize();
});
db.close(() => console.log('All restaurants successfully imported from JSON!'));
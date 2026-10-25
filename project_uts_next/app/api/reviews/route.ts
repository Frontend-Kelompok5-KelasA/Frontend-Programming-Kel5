import { getDatabase } from "@/backend-scripts/database";
import { NextResponse } from "next/server";
import {getSession} from "@/backend-scripts/session-handler";
import {redirect} from "next/navigation";

export async function POST(req: Request){
    const session = await getSession();
    if(!session.userData){
        redirect('/login');
    }

    const { restaurant_id, rating, comment } = await req.json();

    const nilai = Number(rating);
    if (!Number.isInteger(nilai) || nilai < 1 || nilai > 5) {
        return NextResponse.json({ error: 'Rating harus angka 1 sampai 5.' });
    }

    const teks = (comment || '').trim();
    if (!teks) return NextResponse.json({ error: 'Komentar tidak boleh kosong.' });
    if (teks.length > 1000) return NextResponse.json({ error: 'Komentar maksimal 1000 karakter.' });

    const db = await getDatabase();

    try {
        const resto = await db.get('SELECT id FROM restaurant WHERE id = ?', [restaurant_id]);
        if (!resto) return NextResponse.json({ error: 'Restoran tidak ditemukan.' });

        const result = await db.run(
            `INSERT INTO review (user_id, restaurant_id, rating, comment, created_at)
                VALUES (?, ?, ?, ?, datetime('now', 'localtime'))`,
            [session.userData.user_id, restaurant_id, nilai, teks]
        );

        return NextResponse.json({ ok: true, review_id: result.lastID });
    } catch(err: any){
        return NextResponse.json({ error: err.message });
    }
}

export async function GET(){
    const session = await getSession();

    const user = session.userData;
    if(!user){
        redirect('/login');
    }

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

    const db = await getDatabase();

    try {
        const rows = await db.all(query, isAdmin ? [] : [user.user_id]);
        return NextResponse.json({ scope: isAdmin ? 'all' : 'mine', reviews: rows });
    } catch (err: any){
        if (err) return NextResponse.json({ error: err.message });
    }
}
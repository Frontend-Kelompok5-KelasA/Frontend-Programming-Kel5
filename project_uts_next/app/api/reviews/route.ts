import { getPrisma, getRawPrisma } from "@/backend-scripts/database";
import { NextResponse } from "next/server";
import { getSession } from "@/backend-scripts/session-handler";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

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

    const db = getPrisma();

    try {
        const resto = await db.Restaurant.where({ id: restaurant_id }).all();
        if (!resto) return NextResponse.json({ error: 'Restoran tidak ditemukan.' });

        await db.Review.create({
            userId: Number(session.userData.user_id),
            restaurantId: restaurant_id,
            rating: nilai,
            comment: teks,
            createdAt: new Date().toLocaleString('sv-SE')
        });

        return NextResponse.json({ ok: true });
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

    try {
        const db = getRawPrisma();

        const plan = db.raw.sql`
            SELECT rv.review_id, rv.rating, rv.comment, rv.created_at,
                u.username, u.email, u.user_id,
                rs.id AS restaurant_id, rs.name AS restaurant_name, rs.city
            FROM public."Review" rv
            LEFT JOIN public."User" u ON u.user_id = rv.user_id
            LEFT JOIN public."Restaurant" rs ON rs.id = rv.restaurant_id
            ORDER BY rv.review_id DESC
        `
            .returnsRow({
                user_id: 'pg/numeric@1',
                review_id: 'pg/numeric@1',
                rating: 'pg/numeric@1',
                comment: 'pg/text@1',
                created_at: 'pg/text@1',
                username: 'pg/text@1',
                email: 'pg/text@1',
                restaurant_id: 'pg/text@1',
                restaurant_name: 'pg/text@1',
                city: 'pg/text@1'
            })
            .build();

        const rows = await db.query(plan);

        let result = rows;
        if(!isAdmin){
            result = rows.filter((u) => user.user_id === u.user_id);
        }

        return NextResponse.json({ scope: isAdmin ? 'all' : 'mine', reviews: result });
    } catch (err: any){
        if (err) return NextResponse.json({ error: err.message });
    }
}
export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const session = await getSession();
    const user = session?.userData; // sesuaikan dengan cara /api/session membacanya
    if (!user) {
        return NextResponse.json({ error: 'Belum login' }, { status: 401 });
    }
    if (user.role !== 'admin') {
        return NextResponse.json({ error: 'Tidak punya akses' }, { status: 403 });
    }

    try {
        const prisma = getPrisma();
        await prisma.review.delete({ where: { id: Number(id) } });
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Review tidak ditemukan' }, { status: 404 });
    }
}
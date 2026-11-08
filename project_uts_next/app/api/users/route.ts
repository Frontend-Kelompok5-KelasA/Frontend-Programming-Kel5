import { getPrisma } from "@/backend-scripts/database";
import { NextResponse } from "next/server";
import { getSession } from '@/backend-scripts/session-handler'; 
const bcrypt = require('bcrypt');

type Ctx = { params: Promise<{ id: string }> };

const pilihan = { id: true, username: true, email: true, role: true }; 

async function ambilAdmin() {
    const session = await getSession();
    const me = session?.userData; // sesuaikan dengan /api/session
    return me && me.role === 'admin' ? me : null;
}

export async function GET(){
    try {
        const db = getPrisma();

        const result = await db.User
            .orderBy(fields => fields.userId.desc())
            .all();

        return NextResponse.json(result);
    } catch(err: any){
        return NextResponse.json({ error: err.message });
    }
}

export async function PUT(req: Request, { params }: Ctx) {
    const me = await ambilAdmin();
    if (!me) return NextResponse.json({ error: 'Tidak punya akses' }, { status: 403 });

    const { id } = await params;
    const { username, email, role, password } = await req.json();

    if (!username || !email || !role) {
        return NextResponse.json({ error: 'Username, email, dan role wajib diisi' }, { status: 400 });
    }
    if (!['user', 'admin'].includes(role)) {
        return NextResponse.json({ error: 'Role tidak valid' }, { status: 400 });
    }
    if (password && password.length < 8) {
        return NextResponse.json({ error: 'Password minimal 8 karakter' }, { status: 400 });
    }
    if (String(me.id) === id && role !== 'admin') {
        return NextResponse.json({ error: 'Tidak bisa menurunkan role akun sendiri' }, { status: 400 });
    }

    const data: { username: string; email: string; role: string; password?: string } = { username, email, role };
    if (password) data.password = await bcrypt.hash(password, 12);

    try {
        const updated = await getPrisma().user.update({
            where: { id: Number(id) },
            data,
            select: pilihan,
        });
        return NextResponse.json(updated);
    } catch (err) {
        if ((err as { code?: string })?.code === 'P2002') {
            return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 409 });
        }
        console.error(err);
        return NextResponse.json({ error: 'Gagal mengubah user' }, { status: 500 });
    }
}

export async function DELETE(_req: Request, { params }: Ctx) {
    const me = await ambilAdmin();
    if (!me) return NextResponse.json({ error: 'Tidak punya akses' }, { status: 403 });

    const { id } = await params;
    if (String(me.id) === id) {
        return NextResponse.json({ error: 'Tidak bisa menghapus akun sendiri' }, { status: 400 });
    }

    try {
        await getPrisma().user.delete({ where: { id: Number(id) } });
        return NextResponse.json({ success: true });
    } catch (err) {
        if ((err as { code?: string })?.code === 'P2003') {
            return NextResponse.json({ error: 'User masih punya review, hapus review-nya dulu' }, { status: 409 });
        }
        console.error(err);
        return NextResponse.json({ error: 'Gagal menghapus user' }, { status: 500 });
    }
}
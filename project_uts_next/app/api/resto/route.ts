import { getPrisma } from "@/backend-scripts/database";
import { NextResponse } from "next/server";
import { getSession } from '@/backend-scripts/session-handler';

type Ctx = { params: Promise<{ id: string }> };

async function cekAdmin() {
    const session = await getSession();
    const user = session?.userData; // sesuaikan dengan /api/session
    if (!user) return NextResponse.json({ error: 'Belum login' }, { status: 401 });
    if (user.role !== 'admin') return NextResponse.json({ error: 'Tidak punya akses' }, { status: 403 });
    return null;
}

export async function GET(){
    try {
        const db = getPrisma();

        const result = (await db.Restaurant.all()).map(
            (restaurant) => {
                return {
                    ...restaurant,
                    desc: restaurant.description
                };
            }
        );

        return NextResponse.json(result);
    } catch(err: any){
        return NextResponse.json({ error: err.message });
    }
}

export async function PUT(req: Request, { params }: Ctx) {
    const denied = await cekAdmin();
    if (denied) return denied;

    const { id } = await params;
    const { id: _abaikan, ...data } = await req.json();

    try {
        const updated = await getPrisma().restaurant.update({ where: { id }, data });
        return NextResponse.json(updated);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Gagal mengubah restoran' }, { status: 500 });
    }
}

export async function DELETE(_req: Request, { params }: Ctx) {
    const denied = await cekAdmin();
    if (denied) return denied;

    const { id } = await params;
    try {
        await getPrisma().restaurant.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Gagal menghapus restoran' }, { status: 500 });
    }
}
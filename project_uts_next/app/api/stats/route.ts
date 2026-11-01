import { getPrisma } from "@/backend-scripts/database";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const db = getPrisma();
        return NextResponse.json({
            user: await db.User.count(),
            restoran: await db.Restaurant.count(),
            review: await db.Review.count()
        });
    } catch(err: any){
        return NextResponse.json({ error: err.message });
    }
}
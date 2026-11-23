import { getPrisma } from "@/backend-scripts/database";
import { NextResponse } from "next/server";

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
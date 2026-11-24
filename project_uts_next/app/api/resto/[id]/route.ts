import { getPrisma, getRawPrisma } from "@/backend-scripts/database";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const restoId = (await params).id;

    const { restoData } = await req.json();

    const db = getRawPrisma();

    const plan = db.raw.sql`
          UPDATE public."Restaurant"
          SET cat = ${restoData.cat}, 
              city = ${restoData.city}, 
              description = ${restoData.description},
              image = ${restoData.image}, 
              instagram = ${restoData.instagram}, 
              name = ${restoData.name},
              official_website = ${restoData.officialWebsite}, 
              open_hour = ${restoData.openHour},
              place = ${restoData.place}, 
              price = ${restoData.price}, 
              rating = ${restoData.rating},
              status = ${restoData.status}, 
              tag = ${restoData.tag}
          WHERE id = ${restoId}
      `
      .returnsRow({})
      .build();

    await db.query(plan);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
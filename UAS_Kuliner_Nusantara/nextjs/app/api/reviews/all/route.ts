import { NextResponse } from "next/server";
import { joinReviews } from "../../../../backend-scripts/store";

export async function GET() {
  try {
    return NextResponse.json({ scope: "all", reviews: await joinReviews() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}
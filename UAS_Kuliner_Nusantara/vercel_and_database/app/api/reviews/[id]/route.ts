import { getPrisma, getRawPrisma } from "../../../../backend-scripts/database";
import { NextResponse } from "next/server";

export async function PUT() {
  try {
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

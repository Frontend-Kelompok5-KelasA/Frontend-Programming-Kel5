import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const ALLOWED: Record<string, string> = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/webp": ".webp",
};
const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("image");

        if (!(file instanceof File)) {
            return NextResponse.json({ error: "Image file not found" }, { status: 400 });
        }

        const ext = ALLOWED[file.type];
        if (!ext) {
            return NextResponse.json({ error: "Format must be PNG, JPG, or WEBP" }, { status: 400 });
        }

        if (file.size > MAX_SIZE) {
            return NextResponse.json({ error: "Max 5 MB" }, { status: 400 });
        }

        const filename = `${randomUUID()}${ext}`;
        const dir = path.join(process.cwd(), "public", "images");

        await mkdir(dir, { recursive: true });
        await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));

        return NextResponse.json({ filename });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
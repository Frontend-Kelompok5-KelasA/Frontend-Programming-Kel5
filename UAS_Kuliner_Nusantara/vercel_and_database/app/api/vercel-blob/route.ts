import { handleUpload, HandleUploadBody } from "@vercel/blob/client";
import {NextResponse} from "next/server";

export async function POST(request: Request){
  const body = (await request.json()) as HandleUploadBody;

  const jsonResponse = await handleUpload({
    body,
    request,
    onBeforeGenerateToken: async () => ({
      allowedContentTypes: ["image/jpeg", "image/png", "image/webp"],
    })
  });

  return NextResponse.json(jsonResponse);
}
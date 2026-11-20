// import NextRequest & NextRespone untuk menangani request dan response
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/backend-scripts/session-handler";

// mengambil sesi pengguna yang akses
export async function middleware(request: NextRequest){
    const session = await getSession();
    // ? (opsional chaining), agar kalau userData gada, hasilnya undefined, bukan error
    if(session.userData?.role !== "admin"){
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*']
}
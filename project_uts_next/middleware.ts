import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/backend-scripts/session-handler";

export async function middleware(request: NextRequest){
    const session = await getSession();
    if(session.userData?.role !== "admin"){
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*']
}
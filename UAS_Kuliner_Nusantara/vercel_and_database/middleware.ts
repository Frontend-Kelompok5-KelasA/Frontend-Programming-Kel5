// import NextRequest & NextRespone untuk menangani request dan response
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/backend-scripts/session-handler";

// aturan page
const ADMIN_PAGES = ["/admin", "/restaurant/edit"];

const RESTAURANT_PAGES = ["/restaurant"];

const SHARED_PAGES = [
  "/about-us", "/explore", "/favorites", "/customer-service"
];

const USER_PAGES = ["/users"];

const GUEST_ONLY = ["/auth/login", "/auth/sign-up"];

const match = (pathname: string, base: string) =>
  pathname.startsWith(base);

const inList = (pathname: string, list: string[]) =>
  list.some((p) => pathname.startsWith(p));

// mengambil sesi pengguna yang akses
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getSession();
  const role = session.userData?.role;

  if(pathname === "/" || match(pathname, "/auth/logout"))return NextResponse.next();

  if(inList(pathname, SHARED_PAGES)){
    return NextResponse.next();
  }

  switch(role){
    case "admin":
      if(inList(pathname, ADMIN_PAGES) || inList(pathname, USER_PAGES))return NextResponse.next();

      return NextResponse.redirect(new URL("/admin", request.url));

    case "restaurant":
      if(inList(pathname, RESTAURANT_PAGES) || inList(pathname, USER_PAGES))return NextResponse.next();

      return NextResponse.redirect(new URL("/restaurant", request.url));

    case "user":
      if(inList(pathname, USER_PAGES))return NextResponse.next();

      return NextResponse.redirect("/");

    default:
      if(inList(pathname, GUEST_ONLY) && !role){
        return NextResponse.next();
      }

      return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};

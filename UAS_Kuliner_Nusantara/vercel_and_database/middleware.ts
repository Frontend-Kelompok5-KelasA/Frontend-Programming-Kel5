// import NextRequest & NextRespone untuk menangani request dan response
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/backend-scripts/session-handler";

// aturan page
const ADMIN_PAGES = [
  "/admin",
  "/tambah_resto",
  "/user_detail",
  "/restoran_detail",
  "/review_detail",
  "/user_settings",
  "/edit_resto",
  "/edit_user",
  "/manage-content"
];

const RESTAURANT_PAGES = ["/restaurant", "/edit_resto", "/user_settings"];

const USER_PAGES = ["/favorites", "/profile", "/user_settings"];

const GUEST_ONLY = ["/login", "/sign-up"];

const match = (pathname: string, base: string) =>
  pathname === base || pathname.startsWith(base + "/");

const inList = (pathname: string, list: string[]) =>
  list.some((p) => pathname.startsWith(p));

// mengambil sesi pengguna yang akses
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getSession();
  const role = session.userData?.role;

  if (match(pathname, "/logout")) return NextResponse.next();

  if (role === "admin") {
    if (inList(pathname, ADMIN_PAGES)) return NextResponse.next();
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (role === "restaurant") {
    if (inList(pathname, RESTAURANT_PAGES)) return NextResponse.next();
    return NextResponse.redirect(new URL("/restaurant", request.url));
  }  

  if (inList(pathname, ADMIN_PAGES) || match(pathname, "/restaurant")) {
    return NextResponse.redirect(new URL(role ? "/" : "/login", request.url));
  }

  if (inList(pathname, GUEST_ONLY)) {
    if (role) return NextResponse.redirect(new URL("/", request.url));
    return NextResponse.next();
  }
  if (inList(pathname, USER_PAGES) && !role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};

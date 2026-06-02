import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

const PUBLIC_ROUTES = ["/", "/home", "/login", "/register", "/forgot-password"];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    route === "/" ? pathname === "/" : pathname.startsWith(route)
  );

  const allCookies = request.cookies.getAll();
  console.log(`PROXY [${pathname}]: Cookies received:`, allCookies.map(c => c.name));

  const token = request.cookies.get("session")?.value;
  const session = await decrypt(token);

  // Allow next.js internal assets
  if (pathname.match(/^\/(_next|favicon\.ico)/)) return NextResponse.next();

  if (!isPublicRoute && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isPublicRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};

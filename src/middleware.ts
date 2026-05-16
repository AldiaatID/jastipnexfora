import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-change-me-please-32characters"
);
const COOKIE_NAME = "jf_session";

export const config = {
  matcher: ["/dashboard/:path*"],
};

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  try {
    await jwtVerify(token, SECRET);
    return NextResponse.next();
  } catch {
    const url = new URL("/login", req.url);
    return NextResponse.redirect(url);
  }
}

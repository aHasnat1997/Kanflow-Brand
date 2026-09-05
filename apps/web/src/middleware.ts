import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Protected routes that require authentication. */
const PROTECTED_ROUTES = ["/boards"];
/** Auth routes that should redirect to /boards if already logged in. */
const AUTH_ROUTES = ["/login", "/register"];

/**
 * Next.js middleware for session-based route protection.
 *
 * Since the JWT lives in an httpOnly cookie readable only by the server,
 * we forward a server-side request to `GET /auth/me` to determine if the
 * session is valid.
 *
 * - Unauthenticated requests to protected routes → redirect to /login
 * - Authenticated requests to auth routes → redirect to /boards
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  // Forward the cookie header to the server for validation
  const serverUrl = process.env["INTERNAL_SERVER_URL"] ?? process.env["NEXT_PUBLIC_SERVER_URL"] ?? "http://localhost:5000";
  let isAuthenticated = false;

  try {
    const meResponse = await fetch(`${serverUrl}/auth/me`, {
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
    });
    isAuthenticated = meResponse.ok;
    
    if (!isAuthenticated) {
      console.error(`[Middleware Auth Failed] Status: ${meResponse.status}`);
      console.error(`[Middleware Auth Failed] Response: ${await meResponse.text().catch(() => "could not read body")}`);
    }
  } catch (error) {
    console.error(`[Middleware Auth Error] Fetch to ${serverUrl}/auth/me failed:`, error);
    isAuthenticated = false;
  }

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/boards", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

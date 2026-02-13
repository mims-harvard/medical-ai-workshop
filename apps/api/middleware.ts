/**
 * Next.js Middleware — API authentication and authorization.
 *
 * Route protection rules:
 *   Public:  /api/health, /api/swagger, /docs
 *   User:   /api/conversations/**  (any valid JWT)
 *   Admin:  /api/patients/**       (JWT with app_metadata.role === "admin")
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getUserRole } from "@/lib/auth";

// Routes that require admin role
const ADMIN_PREFIXES = ["/api/patients"];

// Routes that require any authenticated user
const USER_PREFIXES = ["/api/conversations"];

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this route requires auth
  const isAdminRoute = ADMIN_PREFIXES.some((p) => pathname.startsWith(p));
  const isUserRoute = USER_PREFIXES.some((p) => pathname.startsWith(p));

  if (!isAdminRoute && !isUserRoute) {
    return NextResponse.next();
  }

  // Verify the token
  const authHeader = request.headers.get("authorization");
  const payload = await verifyToken(authHeader);

  if (!payload) {
    return jsonError(
      "Unauthorized — provide a valid Bearer token in the Authorization header",
      401
    );
  }

  // Check role for admin routes
  if (isAdminRoute) {
    const role = getUserRole(payload);
    if (role !== "admin") {
      return jsonError(
        "Forbidden — this endpoint requires admin privileges",
        403
      );
    }
  }

  // Attach user info as headers for downstream route handlers
  const response = NextResponse.next();
  response.headers.set("x-user-id", payload.sub);
  response.headers.set("x-user-role", getUserRole(payload));
  return response;
}

export const config = {
  matcher: ["/api/patients/:path*", "/api/conversations/:path*"],
};

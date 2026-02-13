/**
 * Authentication utilities for the Virtual Clinic API.
 *
 * Verifies JWTs signed with the Supabase JWT secret (HS256).
 * Tokens can be minted via `pnpm create-tokens` for workshop distribution.
 */

import { jwtVerify, type JWTPayload } from "jose";

export interface AuthPayload extends JWTPayload {
  sub: string;
  role?: string;
  app_metadata?: {
    role?: string;
  };
}

export type UserRole = "admin" | "user";

/**
 * Verify a JWT from the Authorization header.
 * Returns the decoded payload on success, or null on failure.
 */
export async function verifyToken(
  authHeader: string | null
): Promise<AuthPayload | null> {
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice(7);
  const secret = process.env.SUPABASE_JWT_SECRET;

  if (!secret) {
    console.error("SUPABASE_JWT_SECRET is not set");
    return null;
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
      { algorithms: ["HS256"] }
    );
    return payload as AuthPayload;
  } catch {
    return null;
  }
}

/**
 * Extract the user's role from the JWT payload.
 * Admin role is determined by `app_metadata.role === "admin"`.
 */
export function getUserRole(payload: AuthPayload): UserRole {
  return payload.app_metadata?.role === "admin" ? "admin" : "user";
}

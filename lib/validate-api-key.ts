// lib/validate-api-key.ts
import { NextRequest, NextResponse } from "next/server";
import { apiResponse } from "./server.utils";

// ── Only public routes need API key ──
const PUBLIC_ROUTES = ["/api/public"];

// ── These routes skip everything ──
const SKIP_ROUTES = ["/api/auth", "/api/admin"];

export function shouldCheckApiKey(pathname: string): boolean {
  // skip routes first
  const isSkipped = SKIP_ROUTES.some((route) => pathname.startsWith(route));
  if (isSkipped) return false;

  // public routes need API key
  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
  return isPublic;
}

export function validateApiKey(req: NextRequest): NextResponse | null {
  const pathname = req.nextUrl.pathname;

  if (!shouldCheckApiKey(pathname)) return null; // skip

  const apiKey = req.headers.get("x-api-key");

  if (!apiKey) {
    return apiResponse(false, 401, "API key is required!");
  }

  if (apiKey !== process.env.PUBLIC_API_KEY) {
    return apiResponse(false, 403, "Invalid API key!");
  }

  return null; // valid
}

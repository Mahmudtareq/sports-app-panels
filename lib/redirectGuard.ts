"use client";
import { signOut } from "next-auth/react";

// lib/redirectGuard.ts
export function rethrowIfRedirect(error: unknown): void {
  if ((error as any)?.digest?.startsWith("NEXT_REDIRECT")) {
    throw error;
  }
}

export async function handleAuthError(response: any) {
  if (response?.message === "TOKEN_EXPIRED") {
    await signOut({ callbackUrl: "/admin/login" });
    return true;
  }
  return false;
}

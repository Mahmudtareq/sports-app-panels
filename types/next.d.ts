import { AuthResult } from "@/lib/authenticate";
import "next/server";
import "next-auth";

declare module "next/server" {
  interface NextRequest {
    user?: AuthResult;
  }
}

declare module "next-auth" {
  interface Session {
    token?: string;
  }
}

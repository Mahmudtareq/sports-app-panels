import { routes } from "@/config/routes";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
// Helper to safely read environment variables
const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`❌ Missing environment variable: ${key}`);
  return value;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      async authorize(credentials) {
        return credentials;
      },
    }),
  ],

  // Type-safe environment variable
  secret: "NEXTAUTH_SECRET",

  pages: {
    signIn: routes.privateRoutes.admin.dashboard,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user && (user as any).token) {
        token.accessToken = (user as any).token;
      }
      return token;
    },
    async session({ token }) {
      return {
        token: token.accessToken,
        expires: token.exp,
      } as any;
    },
  },
});

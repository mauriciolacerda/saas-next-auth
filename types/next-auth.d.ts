import { Session as NextAuthSession } from "next-auth";

declare module "next-auth" {
  interface Session extends NextAuthSession {
    user: {
      id: string;
      company?: string;
      jobTitle?: string;
    } & NextAuthSession["user"];
  }
  interface User extends NextAuthUser {
    company?: string;
    jobTitle?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    picture?: string;
    company?: string;
    jobTitle?: string;
  }
}
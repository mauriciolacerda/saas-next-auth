import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";

const prisma = new PrismaClient();

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;

if (!googleClientId || !googleClientSecret || !nextAuthSecret) {
  throw new Error("Missing environment variables for authentication");
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (user && user.password) {
          const isValid = await compare(credentials.password, user.password);
          if (isValid) {
            return {
              ...user,
              id: user.id,
              company: user.company ?? undefined,
              jobTitle: user.jobTitle ?? undefined,
            };
          }
        }
        return null;
      },
    }),
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account && account.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email ?? "" },
        });

        if (existingUser) {
          await prisma.account.upsert({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
            update: {
              userId: existingUser.id,
            },
            create: {
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              refresh_token: account.refresh_token,
              expires_at: account.expires_at,
            },
          });

          await prisma.user.update({
            where: { id: existingUser.id },
            data: { name: user.name, image: (profile as { picture: string }).picture },
          });
        } else {
          await prisma.user.create({
            data: {
              email: user.email ?? "",
              name: user.name,
              image: (profile as { picture: string }).picture,
              accounts: {
                create: {
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  refresh_token: account.refresh_token,
                  expires_at: account.expires_at,
                },
              },
            },
          });
        }
      }
      return true;
    },
    async session({ session, token }) {
      if(session?.user) {
        session.user.id = token.id
        session.user.image = token.picture
        session.user.company = token.company
        session.user.jobTitle = token.jobTitle
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.company = user.company;
        token.jobTitle = user.jobTitle;
        
      }
      if (trigger === "update" && session) {
        token.name = session.name;
        token.company = session.company;
        token.jobTitle = session.jobTitle;
        token.picture = session.image;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: nextAuthSecret,
};

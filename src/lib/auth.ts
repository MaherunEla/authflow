import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email",
        },
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user && account) {
        let email = user.email;

        if (account.provider === "github" && !email && account.access_token) {
          try {
            const res = await fetch("https://api.github.com/user/emails", {
              headers: {
                Authorization: `token ${account.access_token}`,
                Accept: "application/vnd.github.v3+json",
              },
            });

            if (!res.ok) {
              throw new Error(`Github email fetch failed:${res.status}`);
            }

            const emails = await res.json();

            if (Array.isArray(emails)) {
              const primaryEmail = emails.find((e) => e.primary && e.verified);
              if (primaryEmail) {
                email = primaryEmail.email;
              }
            }
          } catch (err) {
            console.error("Error fetching GitHub email:", err);
          }
        }

        if (!email) {
          throw new Error("GitHub did not return a verified email.");
        }

        const existingUser = await prisma.user.findUnique({
          where: { email: email },
        });

        if (!existingUser && email) {
          await prisma.user.create({
            data: {
              email,
              name: user.name ?? profile?.name ?? "No Name",
              role: "GUEST",
              provider: account.provider,
              lastLoginAt: new Date(),
            },
          });
        } else {
          await prisma.user.update({
            where: { id: existingUser?.id },
            data: {
              lastLoginAt: new Date(),
            },
          });
        }
        token.user = {
          id: existingUser?.id ?? user.id,
          name: user.name,
          email,
          provider: account.provider,
          role: existingUser?.role ?? "GUEST",
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as {
        id: string;
        name?: string;
        email?: string;
        role: string;
        provider: string;
        token: string;
      };
      return session;
    },
    async redirect({ baseUrl }) {
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
  },
};

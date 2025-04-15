import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string;
      email?: string;
      role: string; // Add role here
      provider: string;
      token: string;
    };
  }

  interface User {
    id: string;
    name?: string;
    email?: string;
    role: string; // Add role here
    token: string;
    provider: string;
  }
}

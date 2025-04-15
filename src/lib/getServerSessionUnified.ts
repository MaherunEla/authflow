import { getServerSession as getAuthSession } from "next-auth";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/lib"; // Your custom decrypt method
// your custom session type (user + expires)
import { authOptions } from "./auth";

export async function getServerSessionUnified() {
  // First: Try to get session from NextAuth (OAuth login)
  const authSession = await getAuthSession(authOptions);
  if (authSession?.user) {
    return {
      user: authSession.user,
      source: "next-auth",
    };
  }

  // Then: Try to get session from custom JWT (email/password login)
  const cookieStore = await cookies();
  const token = cookieStore.get("custom_jwt")?.value;

  if (!token) return null;

  try {
    const parsed = await decrypt(token);
    if (!parsed) return null;

    const isExpired = new Date(parsed.expires) < new Date();

    if (isExpired) return null;

    return {
      user: parsed.user,
      source: "custom-jwt",
    };
  } catch (error) {
    console.error("Session decrypt error:", error);
    return null;
  }
}

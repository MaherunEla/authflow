import { prisma } from "@/lib/prisma";
import speakeasy from "speakeasy";
import { verifyTempToken } from "@/lib/tempToken";
import { createCustomJWT } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { tempToken, token } = await req.json();

  const userId = verifyTempToken(tempToken);
  if (!userId) {
    return Response.json({ error: "Session expired" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.twoFaSecret) {
    return Response.json({ error: "Invalid user or password" });
  }

  const verified = speakeasy.totp.verify({
    secret: user.twoFaSecret,
    encoding: "base32",
    token,
  });

  if (!verified) {
    return Response.json({ error: "Invalid 2FA code" }, { status: 400 });
  }

  const jwt = createCustomJWT({
    id: user.id,
    email: user.email,
    name: user.name || "",
    role: user.role,
    twoFaEnabled: user.twoFaEnabled,
  });

  const Cookies = await cookies();

  Cookies.set("custom_jwt", jwt, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

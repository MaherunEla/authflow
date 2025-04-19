import { prisma } from "@/lib/prisma";
import speakeasy from "speakeasy";
import { verifyTempToken } from "@/lib/tempToken";
import { createCustomJWT } from "@/lib/jwt";
import { LogLoginAttempt } from "@/lib/logLoginAttempt";
import { LoginStatus } from "@prisma/client";

export async function POST(req: Request) {
  const { tempToken, token } = await req.json();

  const userId = verifyTempToken(tempToken);
  if (!userId) {
    await LogLoginAttempt({
      email: "Unknown or missing",
      success: LoginStatus.FAILURE,
      reason: "Session expired",
      request: req,
    });
    return Response.json({ error: "Session expired" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.twoFaSecret) {
    await LogLoginAttempt({
      email: user?.email || "Unknown or missing",
      success: LoginStatus.FAILURE,
      reason: "2FA verification failed: User not found or missing secret",
      request: req,
    });
    return Response.json({ error: "Invalid user or password" });
  }

  const verified = speakeasy.totp.verify({
    secret: user.twoFaSecret,
    encoding: "base32",
    token,
  });

  if (!verified) {
    await LogLoginAttempt({
      email: user.email || "Unknown or missing",
      success: LoginStatus.FAILURE,
      reason: "Invalid 2FA code",
      request: req,
    });
    return Response.json({ error: "Invalid 2FA code" }, { status: 400 });
  }

  const jwt = createCustomJWT(user.id);
  await LogLoginAttempt({
    email: user.email,
    success: LoginStatus.SUCCESS,
    reason: "2FA verified",
    request: req,
  });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Set-Cookie": `custom_jwt=${jwt}; Path=/; HttpOnly; Max-Age=604800;`,
      "Content-Type": "application/json",
    },
  });
}

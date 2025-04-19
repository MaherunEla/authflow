import { LoginStatus } from "@prisma/client";
import { getLocationFromIP } from "./ip";
import { prisma } from "./prisma";

type LogLoginAttemptParams = {
  email: string;
  success: LoginStatus;
  reason?: string;
  request: Request;
};

export async function LogLoginAttempt({
  email,
  success,
  reason,
  request,
}: LogLoginAttemptParams) {
  const userAgent = request.headers.get("user-agent") || "unknown";
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const location = await getLocationFromIP(ip);
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  await prisma.loginAttempt.create({
    data: {
      email,
      userId: user?.id ?? null,
      success,
      reason,
      ip,
      userAgent,
      location,
    },
  });
}

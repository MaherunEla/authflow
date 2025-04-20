import { LoginStatus } from "@prisma/client";
import { getLocationFromIP } from "./ip";
import { prisma } from "./prisma";

type LogLoginAttemptParams = {
  email: string;
  success: LoginStatus;
  reason?: string;
  userAgent: string;
  ip: string;
};

export async function LogLoginAttempt({
  email,
  success,
  reason,
  userAgent,
  ip,
}: LogLoginAttemptParams) {
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

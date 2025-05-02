import { getServerSessionUnified } from "./getServerSessionUnified";
import { prisma } from "./prisma";

export async function getSuspiciousActivity() {
  const session = await getServerSessionUnified();

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const suspiciousUser = await prisma.suspiciousActivity.findMany({
    select: {
      id: true,
      type: true,
      createdAt: true,
      ip: true,
      location: true,
      actionTaken: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return suspiciousUser;
}

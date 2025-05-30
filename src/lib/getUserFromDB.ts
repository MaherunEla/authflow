import { getServerSessionUnified } from "./getServerSessionUnified";
import { prisma } from "./prisma";

export async function getUserFromDB() {
  const session = await getServerSessionUnified();

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      provider: true,
      status: true,
      twoFaEnabled: true,
      lastLoginAt: true,
    },
    orderBy: {
      lastLoginAt: "desc",
    },
  });

  return users;
}

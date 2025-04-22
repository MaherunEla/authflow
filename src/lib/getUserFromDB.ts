import { getServerSessionUnified } from "./getServerSessionUnified";
import { prisma } from "./prisma";

export async function getUserFromDB() {
  const session = await getServerSessionUnified();

  //   if (!session || session.user.role !== "ADMIN") {
  //     throw new Error("Unauthorized");
  //   }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      twoFaEnabled: true,
    },
  });

  return users;
}

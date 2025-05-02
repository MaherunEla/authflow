import { getServerSessionUnified } from "./getServerSessionUnified";
import { prisma } from "./prisma";

export async function recentLoginActivity() {
  const session = await getServerSessionUnified();

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const users = await prisma.session.findMany({
    select: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          lastLoginAt: true,
        },
      },
      ip: true,
      location: true,
      device: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users;
}

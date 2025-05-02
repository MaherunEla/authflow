import { getServerSessionUnified } from "./getServerSessionUnified";
import { prisma } from "./prisma";

export async function getnewuserdata() {
  const session = await getServerSessionUnified();

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const recentUsers = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 15,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  return recentUsers;
}

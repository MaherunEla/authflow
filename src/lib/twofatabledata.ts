import { getServerSessionUnified } from "./getServerSessionUnified";
import { prisma } from "./prisma";

export async function gettwofatabledata() {
  const session = await getServerSessionUnified();

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const User = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      twoFaEnabled: true,
    },
  });
  return User;
}

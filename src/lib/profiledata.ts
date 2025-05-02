import { getServerSessionUnified } from "./getServerSessionUnified";
import { prisma } from "./prisma";

export async function getprofiledata() {
  const session = await getServerSessionUnified();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email },
    select: {
      id: true,
      name: true,
      email: true,
      twoFaEnabled: true,
      updatedAt: true,
    },
  });

  return user;
}

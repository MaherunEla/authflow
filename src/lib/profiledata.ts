import { getServerSessionUnified } from "./getServerSessionUnified";
import { prisma } from "./prisma";

export async function getprofiledata() {
  const session = await getServerSessionUnified();

  if (!session || !session?.user?.email) {
    throw new Error(
      "Unauthorized: Email not available in session, using fallback value."
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      twoFaEnabled: true,
      updatedAt: true,
    },
  });

  return user;
}

import { getServerSessionUnified } from "./getServerSessionUnified";
import { prisma } from "./prisma";

export async function getprofiledata() {
  const session = await getServerSessionUnified();

  if (!session) {
    throw new Error("Unauthorized");
  }

  if (!session?.user?.email) {
    console.warn("Email not available in session, using fallback value.");

    session.user.email = "Email not available";
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

import { subDays } from "date-fns";
import { getServerSessionUnified } from "./getServerSessionUnified";
import { prisma } from "./prisma";

export async function getcarddata() {
  const session = await getServerSessionUnified();

  const sevenDaysAgo = subDays(new Date(), 7);

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const totaluser = await prisma.user.count();
  const activeuser = await prisma.user.count({
    where: { status: "ACTIVE" },
  });
  const suspenduser = await prisma.user.count({
    where: {
      status: "SUSPENDED",
    },
  });
  const newuser = await prisma.user.count({
    where: {
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
  });

  return { totaluser, activeuser, suspenduser, newuser };
}

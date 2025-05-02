import { getServerSessionUnified } from "./getServerSessionUnified";
import { prisma } from "./prisma";

export async function getAuditlog() {
  const session = await getServerSessionUnified();

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const AdminlogHistory = await prisma.adminActionLog.findMany({
    select: {
      id: true,
      adminId: true,
      admin: {
        select: {
          email: true,
        },
      },
      targetId: true,
      actionTargetType: true,
      actionType: true,
      notes: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return AdminlogHistory;
}

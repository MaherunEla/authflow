import { getServerSessionUnified } from "./getServerSessionUnified";
import { prisma } from "./prisma";

export async function failedLogin() {
  const session = await getServerSessionUnified();

  //   if (!session || session.user.role !== "ADMIN") {
  //     throw new Error("Unauthorized");
  //   }

  const attempts = await prisma.loginAttempt.groupBy({
    by: ["email"],
    where: {
      success: "FAILURE",
      createdAt: {
        gte: new Date(Date.now() - 1000 * 60 * 60 * 24),
      },
    },
    _count: {
      _all: true,
    },
    _max: {
      createdAt: true,
      ip: true,
      location: true,
    },
  });

  const emails = attempts.map((a) => a.email);

  const users = await prisma.user.findMany({
    where: {
      email: { in: emails },
    },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
    },
  });

  const result = attempts.map((attempt) => {
    const user = users.find((u) => u.email === attempt.email);
    const statusLabel =
      user?.status === "LOCKED"
        ? "Locked"
        : attempt._count._all >= 3
          ? "Suspicious"
          : "Normal";
    return {
      id: user?.id || "",
      email: attempt.email || "",
      name: user?.name || "",
      attempts: attempt._count._all,
      lastattempt: attempt._max.createdAt
        ? attempt._max.createdAt.toISOString()
        : "Unknown",
      ipaddress: attempt._max.ip || "",
      location: attempt._max.location || "",
      status: statusLabel,
    };
  });

  return result;
}

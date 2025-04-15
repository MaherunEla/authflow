import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// import { PrismaClient } from "@prisma/client";

// const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// export const prisma = globalForPrisma.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// export default prisma;
// lib/prisma.ts
// import { PrismaClient } from "@prisma/client";

// declare global {
//   var prisma: PrismaClient | undefined;
// }

// export const prisma = global.prisma ?? new PrismaClient();

// if (process.env.NODE_ENV !== "production") {
//   global.prisma = prisma;
// }
// lib/prisma.ts

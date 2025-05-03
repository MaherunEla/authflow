// lib/prisma.ts
import { PrismaClient } from "@prisma/client";
let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    // @ts-expect-error - suppress TS error for internal field
    __internal: {
      engine: {
        statement_cache: false,
      },
    },
  });
} else {
  // In dev mode, reuse the client to avoid exhausting connections
  const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
  };

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      // @ts-expect-error - suppress TS error for internal field
      __internal: {
        engine: {
          statement_cache: false,
        },
      },
    });
  }

  prisma = globalForPrisma.prisma;
}

export { prisma };

// import { PrismaClient } from "@prisma/client";

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined;
// };

// export const prisma =
//   globalForPrisma.prisma ??
//   new PrismaClient({
//     // @ts-expect-error - suppress TS error for internal field
//     __internal: {
//       engine: {
//         statement_cache: false,
//       },
//     },
//   });

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

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

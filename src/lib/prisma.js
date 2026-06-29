import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"], // Optional: helpful during dev
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;

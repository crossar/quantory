import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  __internal: {
    engine: {
      env: {
        PRISMA_DISABLE_PREPARED_STATEMENTS: "true",
      },
    },
  },
});

export default prisma;

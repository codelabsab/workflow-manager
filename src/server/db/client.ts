import type { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

import { env } from "env/server.mjs";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const developmentLogging: Prisma.LogLevel[] = env.VERBOSE_DEV_LOGGING
  ? ["query", "error", "warn"]
  : ["error", "warn"];

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: env.NODE_ENV === "development" ? developmentLogging : ["error"],
  });

if (env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

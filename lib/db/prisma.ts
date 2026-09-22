import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var prismaDbConnected: boolean | undefined;
  // eslint-disable-next-line no-var
  var prismaDbCheckedAt: number | undefined;
  // eslint-disable-next-line no-var
  var prismaDbCheckInFlight: Promise<boolean> | undefined;
}

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['error', 'warn']
        : ['error'],
  });
}

export const prisma: PrismaClient = globalThis.prismaGlobal ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

const CONNECTIVITY_TTL_MS = 30_000;

/**
 * Checks whether the PostgreSQL database is reachable and configured.
 * Caches on globalThis so parallel catalog queries and HMR reloads
 * do not each pay a multi-second TCP timeout against a downed local DB.
 */
export async function isDatabaseConnected(): Promise<boolean> {
  if (!process.env.DATABASE_URL) {
    return false;
  }

  const now = Date.now();
  if (
    typeof globalThis.prismaDbConnected === 'boolean' &&
    typeof globalThis.prismaDbCheckedAt === 'number' &&
    now - globalThis.prismaDbCheckedAt < CONNECTIVITY_TTL_MS
  ) {
    return globalThis.prismaDbConnected;
  }

  if (globalThis.prismaDbCheckInFlight) {
    return globalThis.prismaDbCheckInFlight;
  }

  globalThis.prismaDbCheckInFlight = (async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      globalThis.prismaDbConnected = true;
    } catch {
      globalThis.prismaDbConnected = false;
    }
    globalThis.prismaDbCheckedAt = Date.now();
    globalThis.prismaDbCheckInFlight = undefined;
    return Boolean(globalThis.prismaDbConnected);
  })();

  return globalThis.prismaDbCheckInFlight;
}

export async function withDatabaseFallback<T>(
  query: () => Promise<T>,
  fallback: () => T | Promise<T>
): Promise<T> {
  if (!(await isDatabaseConnected())) {
    return fallback();
  }

  try {
    return await query();
  } catch {
    globalThis.prismaDbConnected = false;
    globalThis.prismaDbCheckedAt = Date.now();
    return fallback();
  }
}

export default prisma;

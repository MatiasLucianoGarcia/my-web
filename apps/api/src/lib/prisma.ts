import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger.js';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.__prisma ??
  new PrismaClient({
    log:
      process.env['NODE_ENV'] === 'development'
        ? ['query', 'warn', 'error']
        : ['warn', 'error'],
  });

if (process.env['NODE_ENV'] !== 'production') {
  globalThis.__prisma = prisma;
}

export async function connectDB() {
  try {
    await prisma.$connect();
    logger.info('✅ Database connected');
  } catch (error) {
    logger.error(error, '❌ Failed to connect to database');
    process.exit(1);
  }
}

export async function disconnectDB() {
  await prisma.$disconnect();
  logger.info('Database disconnected');
}

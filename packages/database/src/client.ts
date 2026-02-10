import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg'; // Import the Pool
import { PrismaClient } from '../generated/prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    // Optional: Log queries to see if connection works
    // log: ['query', 'info', 'warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export * from '../generated/prisma/client';

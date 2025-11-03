import { PrismaClient } from '@prisma/client'

// Global Prisma instance to prevent multiple connections in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

// Reuse connection in development to avoid connection limit issues
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma


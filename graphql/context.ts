import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'

// GraphQL context with user authentication data
export interface Context {
  prisma: PrismaClient
  userId?: string
  userEmail?: string
}

// Create GraphQL context with authenticated user info
export async function createContext(req: { headers: { get: (name: string) => string | null } }): Promise<Context> {
  const authHeader = req.headers.get('authorization')
  let userId: string | undefined
  let userEmail: string | undefined

  // Extract and verify JWT token from Authorization header
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '')
    const payload = verifyToken(token)
    if (payload) {
      userId = payload.userId
      userEmail = payload.email
    }
  }

  return {
    prisma,
    userId,
    userEmail,
  }
}


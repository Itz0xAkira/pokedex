/**
 * GraphQL Context
 * 
 * Creates the GraphQL context for each request.
 * Extracts and verifies JWT token from Authorization header.
 * Provides Prisma client and authenticated user info to resolvers.
 */

import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'

export interface GraphQLContext {
  prisma: PrismaClient
  userId?: string
  userEmail?: string
}

export async function createContext(req: { headers: { get: (name: string) => string | null } }): Promise<GraphQLContext> {
  const authHeader = req.headers.get('authorization')
  let userId: string | undefined
  let userEmail: string | undefined

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


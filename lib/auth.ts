import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

// Hash password with bcrypt (10 rounds)
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

// Verify password against hash
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Find user by email address
export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  })
}


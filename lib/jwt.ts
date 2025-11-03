/**
 * JWT Token Utilities
 * 
 * Handles JWT token generation and verification for authentication
 */

import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required. Please set it in your .env file.')
}

export interface JwtPayload {
  userId: string
  email: string
}

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  } catch (error) {
    return null
  }
}

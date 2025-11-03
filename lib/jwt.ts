import jwt from 'jsonwebtoken'

// Get JWT secret from environment
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required. Please set it in your .env file.')
  }
  return secret
}

export interface JwtPayload {
  userId: string
  email: string
}

// Generate JWT token with 7-day expiration
export function generateToken(payload: JwtPayload): string {
  const secret = getJwtSecret()
  return jwt.sign(payload, secret, { expiresIn: '7d' })
}

// Verify and decode JWT token
export function verifyToken(token: string): JwtPayload | null {
  try {
    const secret = getJwtSecret()
    const decoded = jwt.verify(token, secret) as unknown as JwtPayload
    return decoded
  } catch (error) {
    return null
  }
}


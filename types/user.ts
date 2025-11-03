/**
 * User and Authentication Type Definitions
 */

/**
 * User entity structure
 */
export interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Authentication payload returned from login/register
 */
export interface AuthPayload {
  token: string;
  user: User;
}

/**
 * Login input data
 */
export interface LoginInput {
  email: string;
  password: string;
}

/**
 * Register input data
 */
export interface RegisterInput {
  email: string;
  password: string;
}

/**
 * JWT payload structure
 */
export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}


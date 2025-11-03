/**
 * Authentication page with login/registration toggle.
 * Handles user authentication and token storage.
 */

'use client'

import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { gql } from '@apollo/client'
import { useRouter } from 'next/navigation'

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
      }
    }
  }
`

const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        email
      }
    }
  }
`

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const [login] = useMutation(LOGIN_MUTATION)
  const [register] = useMutation(REGISTER_MUTATION)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const mutation = isLogin ? login : register
      const { data } = await mutation({
        variables: {
          input: { email, password },
        },
      })

      // Store JWT token and redirect to main app
      if (data) {
        const token = isLogin ? data.login.token : data.register.token
        localStorage.setItem('token', token)
        router.push('/')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#7f7f7f' }}>
      <div className="max-w-md w-full px-6">
        <div className="text-center mb-8">
          <h1 
            className="text-4xl font-normal mb-4 text-gray-300" 
            style={{ fontFamily: 'Flexo-Regular, arial, sans-serif' }}
          >
            Pokédex
          </h1>
          <h2 
            className="text-2xl font-semibold text-white"
            style={{ fontFamily: 'Flexo-Demi, arial, sans-serif' }}
          >
            {isLogin ? 'Welcome Back!' : 'Join the Adventure!'}
          </h2>
        </div>
        <div 
          className="rounded-lg p-8 md:p-10"
          style={{ 
            backgroundColor: '#3d3d3d',
          }}
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-semibold text-white mb-2"
                style={{ fontFamily: 'Flexo-Demi, arial, sans-serif' }}
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg"
                style={{ 
                  backgroundColor: '#fff',
                  color: '#212121',
                  fontFamily: 'Flexo-Regular, arial, sans-serif'
                }}
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-semibold text-white mb-2"
                style={{ fontFamily: 'Flexo-Demi, arial, sans-serif' }}
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg"
                style={{ 
                  backgroundColor: '#fff',
                  color: '#212121',
                  fontFamily: 'Flexo-Regular, arial, sans-serif'
                }}
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div 
                className="rounded-lg p-4"
                style={{ 
                  backgroundColor: '#5a5a5a',
                  border: '2px solid #ee6b2f'
                }}
              >
                <p 
                  className="text-white font-semibold text-sm"
                  style={{ fontFamily: 'Flexo-Demi, arial, sans-serif' }}
                >
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg text-lg font-semibold text-white transition-colors shadow-md"
              style={{ 
                backgroundColor: '#ee6b2f',
                fontFamily: 'Flexo-Demi, arial, sans-serif'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d25915'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ee6b2f'}
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
              }}
              className="text-white hover:text-gray-300 font-semibold transition-colors"
              style={{ fontFamily: 'Flexo-Medium, arial, sans-serif' }}
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Home Page
 * 
 * Main entry point - redirects to login if not authenticated,
 * otherwise shows the Pokemon search page.
 */

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@apollo/client'
import { ME_QUERY } from '@/lib/graphql/queries'

export default function Home() {
  const router = useRouter()
  const { data, loading } = useQuery(ME_QUERY, {
    errorPolicy: 'ignore',
  })

  useEffect(() => {
    if (!loading && !data?.me) {
      router.push('/login')
    }
  }, [data, loading, router])

  // Show loading state to prevent hydration mismatch
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  // Return loading state if not authenticated to prevent hydration mismatch
  // The useEffect will redirect to login
  if (!data?.me) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Redirecting...</div>
      </div>
    )
  }

  // TODO: Replace with full SearchPage component 
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Pokemon App</h1>
        <p className="text-gray-600 mb-4">
          test
        </p>
        <div className="mt-8 p-4 border border-gray-300 rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">Status</h2>
     
        </div>
      </div>
    </main>
  )
}


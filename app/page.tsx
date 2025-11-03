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
import SearchPage from '@/components/SearchPage'

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

  return <SearchPage />
}


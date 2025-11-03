'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'
import SearchPage from '@/components/SearchPage'

const ME_QUERY = gql`
  query Me {
    me {
      id
      email
    }
  }
`

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!data?.me) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Redirecting...</div>
      </div>
    )
  }

  return <SearchPage />
}


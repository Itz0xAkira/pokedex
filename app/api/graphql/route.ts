import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { typeDefs } from '@/graphql/schema'
import { resolvers } from '@/graphql/resolvers'
import { createContext } from '@/graphql/context'
import type { NextRequest } from 'next/server'

// Disable static optimization for GraphQL endpoint
export const dynamic = 'force-dynamic'

// Initialize Apollo Server with schema and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
})

// Create Next.js handler with authentication context
const handler = startServerAndCreateNextHandler(server, {
  context: async (req: NextRequest) => {
    const headers = new Headers(req.headers)
    return createContext({ 
      headers: {
        get: (name: string) => headers.get(name)
      }
    })
  },
})

export async function GET(req: NextRequest) {
  return handler(req)
}

export async function POST(req: NextRequest) {
  return handler(req)
}


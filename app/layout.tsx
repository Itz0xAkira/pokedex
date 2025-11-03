/**
 * Root Layout Component
 * 
 * Root layout with Apollo Client provider and Navbar
 */

import type { Metadata } from 'next'
import { ApolloWrapper } from '@/components/ApolloWrapper'
import Navbar from '@/components/Navbar'
import './globals.css'

export const metadata: Metadata = {
  title: 'PokeDex',
  description: 'gotta catch em all',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ApolloWrapper>
          <Navbar />
          {children}
        </ApolloWrapper>
      </body>
    </html>
  )
}


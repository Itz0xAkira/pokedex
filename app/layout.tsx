/**
 * Root Layout Component
 * 
 * TODO: Add Navbar, Apollo Client wrapper, and global styles
 * This is a placeholder until we migrate the full UI
 */

import type { Metadata } from 'next'
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
      <body>{children}</body>
    </html>
  )
}


/**
 * Global navigation bar with authentication-aware menu items.
 * Shows different actions based on user login status.
 */

'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import Link from 'next/link';

const ME_QUERY = gql`
  query Me {
    me {
      id
      email
    }
  }
`;

export default function Navbar() {
  const router = useRouter();
  
  // Check authentication status
  const { data, loading } = useQuery(ME_QUERY, {
    errorPolicy: 'ignore',
  });

  const isAuthenticated = !!data?.me;

  // Clear token and reload to reset Apollo cache
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
    window.location.reload();
  };

  return (
    <nav 
      className="border-b border-gray-300 shadow-md"
      style={{ fontFamily: 'Flexo-Regular, arial, sans-serif', backgroundColor: '#FAFAFA' }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link 
            href="/"
            className="text-2xl font-normal text-gray-800 hover:text-gray-900 transition-colors"
            style={{ fontFamily: 'Flexo-Regular, arial, sans-serif' }}
          >
            Pokédex
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <Link
                href="/pokemon/new"
                className="px-6 py-2 rounded-lg font-semibold text-white transition-colors"
                style={{ 
                  backgroundColor: '#ee6b2f',
                  fontFamily: 'Flexo-Demi, arial, sans-serif'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d25915'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ee6b2f'}
              >
                Add New Pokemon
              </Link>
            )}


            {loading ? (
              <div className="w-20 h-10 bg-gray-700 rounded-lg animate-pulse" />
            ) : isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="px-6 py-2 rounded-lg font-semibold text-white transition-colors"
                style={{ 
                  backgroundColor: '#a4a4a4',
                  fontFamily: 'Flexo-Demi, arial, sans-serif'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#8b8b8b'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#a4a4a4'}
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="px-6 py-2 rounded-lg font-semibold text-white transition-colors"
                style={{ 
                  backgroundColor: '#30a7d7',
                  fontFamily: 'Flexo-Demi, arial, sans-serif'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#258fb8'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#30a7d7'}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}


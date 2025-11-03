/**
 * GreenInfoBox Component
 * 
 * Displays an informational message in a green box to the right of the search input.
 * Provides context about how to use the search functionality.
 * 
 * This component is positioned alongside the SearchInputSection to create
 * a side-by-side layout matching the design specifications.
 */

'use client'

import React from 'react';

export default function GreenInfoBox() {
  return (
    <div 
      style={{ 
        backgroundColor: '#4caf50', 
        borderRadius: '8px', 
        padding: '1.5rem',
        flex: '0.8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'fit-content'
      }}
    >
      {/* Informational Text */}
      <p 
        style={{ 
          color: '#fff', 
          fontWeight: 500, 
          fontSize: '1.125rem',
          margin: 0,
          fontFamily: 'Flexo-Medium, arial, sans-serif',
          lineHeight: '1.5'
        }}
      >
        Search for a Pokémon by name or using its National Pokédex number.
      </p>
    </div>
  );
}



/**
 * Primary search input for Pokemon name or Pokedex number lookup.
 * Includes search button and helpful guidance text.
 */

'use client'

import React from 'react';
import { SearchIcon } from '../shared/Icons';

interface SearchInputSectionProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onSearch: () => void;
}

export default function SearchInputSection({
  searchTerm,
  onSearchTermChange,
  onSearch,
}: SearchInputSectionProps) {
  // Trigger search on Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div 
      style={{ 
        backgroundColor: '#3d3d3d', 
        borderRadius: '8px', 
        padding: '2rem', 
        flex: '1.5' 
      }}
    >
      <h2 
        style={{ 
          fontSize: '1.5rem', 
          fontWeight: 600, 
          marginBottom: '1rem', 
          color: '#fff',
          fontFamily: 'Flexo-Demi, arial, sans-serif'
        }}
      >
        Name or Number
      </h2>

      <div 
        className="flex gap-4" 
        style={{ marginBottom: '1rem' }}
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder=""
          style={{
            backgroundColor: '#fff',
            color: '#212121',
            fontSize: '1.125rem',
            height: '56px',
            flex: 1,
            borderRadius: '8px',
            padding: '0 1rem',
            border: 'none',
            outline: 'none'
          }}
          aria-label="Search for Pokémon by name or number"
        />

        <button 
          onClick={onSearch}
          style={{
            backgroundColor: '#ee6b2f',
            width: '56px',
            height: '56px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d25915'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ee6b2f'}
          aria-label="Search"
        >
          <SearchIcon className="w-6 h-6 text-white" />
        </button>
      </div>

      <p 
        style={{ 
          color: '#d0d0d0', 
          fontSize: '0.875rem',
          marginTop: '1rem',
          marginBottom: 0,
          fontFamily: 'Flexo-Regular, arial, sans-serif'
        }}
      >
        Use the Advanced Search to explore Pokémon by type, weakness, Ability, and more!
      </p>
    </div>
  );
}



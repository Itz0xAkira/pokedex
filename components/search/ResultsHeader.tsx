/**
 * Results header with random Pokemon discovery and sorting options.
 * Provides quick access to random Pokemon and flexible result ordering.
 */

'use client'

import React from 'react';
import { Dice5, Pokeball, ChevronDown } from '../shared/Icons';

type SortOption = 'number' | 'name' | 'height-asc' | 'height-desc' | 'weight-asc' | 'weight-desc';

interface ResultsHeaderProps {
  onSurpriseMe: () => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
}

export default function ResultsHeader({
  onSurpriseMe,
  sortBy,
  onSortChange,
}: ResultsHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <button 
        onClick={onSurpriseMe}
        className="text-white text-lg px-10 h-12 w-72 rounded-lg font-semibold flex items-center gap-3 transition-colors hover:bg-opacity-90"
        style={{ 
          backgroundColor: '#00bcd4',
          fontFamily: 'Flexo-Demi, arial, sans-serif'
        }}
        aria-label="Surprise me with a random Pokémon"
      >
        <Dice5 className="w-6 h-6" />
        <span>Surprise Me!</span>
      </button>

      <div className="flex items-center gap-4">
        <span 
          className="text-gray-600 font-medium text-lg"
          style={{ fontFamily: 'Flexo-Medium, arial, sans-serif' }}
        >
          Sort By
        </span>

        {/* Custom styled dropdown with Pokeball icon */}
        <div className="relative w-72">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
            <Pokeball className="w-6 h-6 text-gray-400" />
          </div>
          <select 
            value={sortBy} 
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="w-full bg-gray-800 text-white border-0 h-12 pl-12 pr-10 rounded-lg appearance-none cursor-pointer focus:ring-2 focus:ring-cyan-500 shadow-md"
            style={{ fontFamily: 'Flexo-Regular, arial, sans-serif' }}
            aria-label="Sort Pokémon by"
          >
            <option value="number">Lowest Number (First)</option>
            <option value="name">A-Z</option>
            <option value="height-asc">Height (Shortest First)</option>
            <option value="height-desc">Height (Tallest First)</option>
            <option value="weight-asc">Weight (Lightest First)</option>
            <option value="weight-desc">Weight (Heaviest First)</option>
          </select>

          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}



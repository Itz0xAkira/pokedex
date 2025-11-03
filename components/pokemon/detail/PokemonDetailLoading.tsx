/**
 * Pokemon Detail Loading Component
 * 
 * Shows loading state when Pokemon data is being fetched
 */

import React from 'react';

export default function PokemonDetailLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#7f7f7f' }}>
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white" />
    </div>
  );
}


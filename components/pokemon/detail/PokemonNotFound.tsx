/**
 * Pokemon Not Found Component
 * 
 * Shows when a Pokemon is not found
 */

import React from 'react';

export default function PokemonNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#7f7f7f' }}>
      <p 
        className="text-xl text-white"
        style={{ fontFamily: 'Flexo-Regular, arial, sans-serif' }}
      >
        Pokémon not found.
      </p>
    </div>
  );
}


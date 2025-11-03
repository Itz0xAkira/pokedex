/**
 * Pokemon Header Component
 * 
 * Displays the Pokemon name and pokedex number
 */

import React from 'react';

interface PokemonHeaderProps {
  name: string;
  pokedexId: number | null;
}

export default function PokemonHeader({ name, pokedexId }: PokemonHeaderProps) {
  return (
    <div className="text-center py-8 pb-24" style={{ backgroundColor: '#fff' }}>
      <h1 
        className="text-5xl font-normal text-gray-900"
        style={{ fontFamily: 'Flexo-Regular, arial, sans-serif' }}
      >
        {name} #{String(pokedexId || '').padStart(4, '0')}
      </h1>
    </div>
  );
}


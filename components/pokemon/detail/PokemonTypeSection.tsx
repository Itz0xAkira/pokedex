/**
 * Pokemon Type Section Component
 * 
 * Displays Pokemon types with type badges
 */

import React from 'react';
import TypeBadge from '../TypeBadge';

interface PokemonTypeSectionProps {
  types: string[];
}

export default function PokemonTypeSection({ types }: PokemonTypeSectionProps) {
  return (
    <div>
      <h3 
        className="text-2xl font-bold mb-4 text-gray-900"
        style={{ fontFamily: 'Flexo-Demi, arial, sans-serif' }}
      >
        Type
      </h3>
      <div className="flex gap-3">
        {types.map((type: string) => (
          <TypeBadge key={type} type={type} className="px-8 py-2 text-lg" />
        ))}
      </div>
    </div>
  );
}


/**
 * Pokemon Weaknesses Section Component
 * 
 * Displays Pokemon weaknesses with type badges
 */

import React from 'react';
import TypeBadge from '../TypeBadge';

interface PokemonWeaknessesSectionProps {
  weaknesses: string[];
}

export default function PokemonWeaknessesSection({ weaknesses }: PokemonWeaknessesSectionProps) {
  return (
    <div>
      <h3 
        className="text-2xl font-bold mb-4 text-gray-900"
        style={{ fontFamily: 'Flexo-Demi, arial, sans-serif' }}
      >
        Weaknesses
      </h3>
      <div className="flex gap-3 flex-wrap">
        {weaknesses.map((weakness: string) => (
          <TypeBadge key={weakness} type={weakness} className="px-8 py-2 text-lg" />
        ))}
      </div>
    </div>
  );
}


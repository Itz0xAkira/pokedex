/**
 * Pokemon Description Component
 * 
 * Displays the Pokemon description text
 */

import React from 'react';

interface PokemonDescriptionProps {
  description: string | null;
}

export default function PokemonDescription({ description }: PokemonDescriptionProps) {
  return (
    <p 
      className="text-gray-700 text-lg leading-relaxed"
      style={{ fontFamily: 'Flexo-Regular, arial, sans-serif' }}
    >
      {description || 'No description available.'}
    </p>
  );
}


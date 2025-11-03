import React from 'react';
import type { TypeBadgeProps, TypeColors } from '@/types';

const typeColors: TypeColors = {
  Bug: '#A8B820',
  Dark: '#705848',
  Dragon: '#7038F8',
  Electric: '#F8D030',
  Fairy: '#EE99AC',
  Fighting: '#C03028',
  Fire: '#F08030',
  Flying: '#A890F0',
  Ghost: '#705898',
  Grass: '#78C850',
  Ground: '#E0C068',
  Ice: '#98D8D8',
  Normal: '#A8A878',
  Poison: '#A040A0',
  Psychic: '#F85888',
  Rock: '#B8A038',
  Steel: '#B8B8D0',
  Water: '#6890F0'
};

export default function TypeBadge({ type, className = '' }: TypeBadgeProps) {
  return (
    <div 
      className={`px-4 py-1 rounded font-semibold text-white text-center ${className}`}
      style={{ backgroundColor: typeColors[type] || typeColors.Normal }}
    >
      {type}
    </div>
  );
}




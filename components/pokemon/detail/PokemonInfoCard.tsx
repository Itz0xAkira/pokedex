/**
 * Pokemon Info Card Component
 * 
 * Displays Pokemon attributes: Height, Weight, Category/Species, and Abilities
 */

import React from 'react';

interface PokemonInfoCardProps {
  height: number;
  weight: number;
  species: string | null;
  abilities: string[];
}

const HelpCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function PokemonInfoCard({ 
  height, 
  weight, 
  species, 
  abilities 
}: PokemonInfoCardProps) {
  return (
    <div 
      className="rounded-lg p-8 text-white"
      style={{ 
        backgroundColor: '#00bcd4',
        fontFamily: 'Flexo-Regular, arial, sans-serif'
      }}
    >
      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
        <div>
          <p className="text-white/80 text-sm mb-1">Height</p>
          <p 
            className="text-2xl font-bold"
            style={{ fontFamily: 'Flexo-Demi, arial, sans-serif' }}
          >
            {height}m
          </p>
        </div>
        <div>
          <p className="text-white/80 text-sm mb-1">Category</p>
          <p 
            className="text-2xl font-bold"
            style={{ fontFamily: 'Flexo-Demi, arial, sans-serif' }}
          >
            {species || 'Unknown'}
          </p>
        </div>
        <div>
          <p className="text-white/80 text-sm mb-1">Weight</p>
          <p 
            className="text-2xl font-bold"
            style={{ fontFamily: 'Flexo-Demi, arial, sans-serif' }}
          >
            {weight}kg
          </p>
        </div>
        <div>
          <p className="text-white/80 text-sm mb-1 flex items-center gap-2">
            Abilities
            <HelpCircle className="w-4 h-4" />
          </p>
          <div className="space-y-1">
            {abilities.map((ability: string, idx: number) => (
              <p 
                key={idx} 
                className="text-xl font-bold"
                style={{ fontFamily: 'Flexo-Demi, arial, sans-serif' }}
              >
                {ability}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


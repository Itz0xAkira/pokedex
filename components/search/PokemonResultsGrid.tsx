/**
 * PokemonResultsGrid Component
 * 
 * Displays the grid of Pokémon cards with loading and empty states.
 * 
 * Features:
 * - Responsive 4-column grid layout
 * - Loading spinner while data is being fetched
 * - Empty state message when no Pokémon are found
 * - Individual Pokémon cards rendered via PokemonCard component
 * 
 * Props:
 * - pokemon: Array of Pokémon to display
 * - loading: Whether data is currently being fetched
 */

'use client'

import React from 'react';
import PokemonCard from '../pokemon/PokemonCard';

interface Pokemon {
  id: string;
  name: string;
  pokedexId: number | null;
  image: string | null;
  types: string[];
}

interface PokemonResultsGridProps {
  /** Array of Pokémon to display */
  pokemon: Pokemon[];
  /** Whether data is currently being fetched */
  loading: boolean;
}

export default function PokemonResultsGrid({
  pokemon,
  loading,
}: PokemonResultsGridProps) {
  return (
    <>
      {/* Loading State */}
      {loading && (
        <div className="text-center py-20">
          <div 
            className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto"
            aria-label="Loading Pokémon"
          />
          <p className="mt-4 text-gray-600" style={{ fontFamily: 'Flexo-Regular, arial, sans-serif' }}>
            Loading Pokémon...
          </p>
        </div>
      )}

      {/* Results Grid */}
      {!loading && pokemon.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {pokemon.map((poke) => (
            <PokemonCard key={poke.id} pokemon={poke} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && pokemon.length === 0 && (
        <div className="text-center py-20">
          <p 
            className="text-gray-500 text-xl"
            style={{ fontFamily: 'Flexo-Medium, arial, sans-serif' }}
          >
            No Pokémon found.
          </p>
          <p 
            className="text-gray-400 text-sm mt-2"
            style={{ fontFamily: 'Flexo-Regular, arial, sans-serif' }}
          >
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </>
  );
}



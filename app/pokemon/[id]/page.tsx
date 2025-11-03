/**
 * Pokemon detail page with navigation, stats, and comprehensive information.
 * Includes prefetching for smooth navigation and edit capabilities for custom Pokemon.
 */

'use client'

import React, { useState, useTransition, useMemo, useEffect, useRef, useCallback } from 'react';
import { useQuery, useApolloClient } from '@apollo/client';
import { useRouter, useParams } from 'next/navigation';
import { gql } from '@apollo/client';
import Link from 'next/link';
import { POKEMON_QUERY, POKEMONS_LIST_QUERY } from '@/lib/graphql/pokemon-queries';
import { calculateWeaknesses } from '@/lib/pokemon/weaknesses';
import PokemonNavigation from '@/components/pokemon/detail/PokemonNavigation';
import PokemonHeader from '@/components/pokemon/detail/PokemonHeader';
import PokemonImage from '@/components/pokemon/detail/PokemonImage';
import PokemonDescription from '@/components/pokemon/detail/PokemonDescription';
import VersionToggle from '@/components/pokemon/detail/VersionToggle';
import PokemonInfoCard from '@/components/pokemon/detail/PokemonInfoCard';
import PokemonTypeSection from '@/components/pokemon/detail/PokemonTypeSection';
import PokemonWeaknessesSection from '@/components/pokemon/detail/PokemonWeaknessesSection';
import LoadingOverlay from '@/components/pokemon/detail/LoadingOverlay';
import PokemonDetailLoading from '@/components/pokemon/detail/PokemonDetailLoading';
import PokemonNotFound from '@/components/pokemon/detail/PokemonNotFound';
import StatsChart from '@/components/pokemon/StatsChart';
import type { Pokemon } from '@/types/pokemon';

const ME_QUERY = gql`
  query Me {
    me {
      id
      email
    }
  }
`;

interface PokemonListItem {
  id: string;
  name: string;
  pokedexId: number | null;
}

export default function PokemonDetail() {
  const router = useRouter();
  const params = useParams();
  const pokemonName = params.id as string;
  const apolloClient = useApolloClient();
  
  const [isPending, startTransition] = useTransition();
  const [selectedVersion, setSelectedVersion] = useState<'x' | 'y'>('x');

  // Check user authentication for edit permissions
  const { data: userData } = useQuery(ME_QUERY, {
    errorPolicy: 'ignore',
    fetchPolicy: 'cache-first',
  });
  const currentUserId = userData?.me?.id;

  // Fetch current Pokemon with cache-and-network for smooth navigation
  const { data: pokemonData, loading: pokemonLoading, networkStatus } = useQuery(POKEMON_QUERY, {
    variables: { name: pokemonName },
    skip: !pokemonName,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  // Fetch all Pokemon for navigation (cached for performance)
  const { data: allPokemonData } = useQuery(POKEMONS_LIST_QUERY, {
    variables: { 
      page: 1, 
      pageSize: 1000,
      sort: {
        field: 'POKEDEX_ID',
        direction: 'ASC'
      }
    },
    fetchPolicy: 'cache-first',
  });

  // Keep previous Pokemon visible during navigation to prevent flicker
  const pokemonRef = useRef<Pokemon | null>(null);
  const pokemon: Pokemon | null = pokemonData?.pokemon || null;
  
  useEffect(() => {
    if (pokemon) {
      pokemonRef.current = pokemon;
    }
  }, [pokemon]);
  
  const displayPokemon = useMemo(() => {
    return pokemon || pokemonRef.current;
  }, [pokemon]);
  
  const allPokemon: PokemonListItem[] = allPokemonData?.pokemons?.pokemons || [];

  // Find navigation Pokemon by Pokedex ID (more reliable than name)
  const { currentIndex, previousPokemon, nextPokemon } = useMemo(() => {
    const currentPokedexId = displayPokemon?.pokedexId;
    const index = currentPokedexId 
      ? allPokemon.findIndex((p: PokemonListItem) => p.pokedexId === currentPokedexId)
      : allPokemon.findIndex((p: PokemonListItem) => p.name.toLowerCase() === pokemonName?.toLowerCase());
    
    return {
      currentIndex: index,
      previousPokemon: index > 0 ? allPokemon[index - 1] : null,
      nextPokemon: index < allPokemon.length - 1 ? allPokemon[index + 1] : null,
    };
  }, [displayPokemon?.pokedexId, displayPokemon?.name, allPokemon, pokemonName]);

  // Prefetch adjacent Pokemon for smooth navigation
  useEffect(() => {
    if (previousPokemon?.name) {
      apolloClient.query({
        query: POKEMON_QUERY,
        variables: { name: previousPokemon.name },
        fetchPolicy: 'cache-first',
      }).catch(() => {});
    }
    
    if (nextPokemon?.name) {
      apolloClient.query({
        query: POKEMON_QUERY,
        variables: { name: nextPokemon.name },
        fetchPolicy: 'cache-first',
      }).catch(() => {});
    }
  }, [previousPokemon?.name, nextPokemon?.name, apolloClient]);

  // Calculate type weaknesses from Pokemon types
  const weaknesses = useMemo(() => {
    return displayPokemon?.types ? calculateWeaknesses(displayPokemon.types) : [];
  }, [displayPokemon?.types]);

  // Handle navigation with transition for smooth UX
  const handleNavigation = useCallback((newPokemon: { name: string }) => {
    if (newPokemon?.name) {
      startTransition(() => {
        router.push(`/pokemon/${encodeURIComponent(newPokemon.name.toLowerCase())}`);
      });
    }
  }, [router]);

  const isInitialLoading = pokemonLoading && networkStatus === 1 && !displayPokemon;
  if (isInitialLoading) {
    return <PokemonDetailLoading />;
  }

  if (!displayPokemon && !pokemonLoading && networkStatus !== 1) {
    return <PokemonNotFound />;
  }

  return (
    <div className="min-h-screen relative">
      {(!displayPokemon && pokemonLoading) && <LoadingOverlay isPending={true} />}
      
      <div className="max-w-7xl mx-auto" style={{ backgroundColor: 'white' }}>
        <div className="relative">
          <PokemonNavigation
            previousPokemon={previousPokemon}
            nextPokemon={nextPokemon}
            onNavigate={handleNavigation}
          />

          <div className="px-6 -mt-[60px] relative z-10 pb-8">
          <div className={`bg-white rounded-lg overflow-hidden transition-opacity ${(!displayPokemon && pokemonLoading) ? 'opacity-50' : 'opacity-100'}`}>
          
          <PokemonHeader 
            name={displayPokemon?.name || 'Loading...'} 
            pokedexId={displayPokemon?.pokedexId || null} 
          />
          
          <div className="grid grid-cols-2 gap-8 px-8 pb-8">
            <div className="space-y-8">
              <PokemonImage 
                image={displayPokemon?.image || null} 
                name={displayPokemon?.name || 'Pokemon'} 
              />
              {displayPokemon?.baseStats && <StatsChart stats={displayPokemon.baseStats} />}
              {/* Edit button for custom Pokemon owned by current user */}
              {displayPokemon?.isCustom && 
               currentUserId && 
               displayPokemon.id && 
               displayPokemon.createdByUserId === currentUserId && (
                <div className="flex justify-center pt-4">
                  <Link
                    href={`/pokemon/${encodeURIComponent(displayPokemon.name.toLowerCase())}/edit`}
                    className="px-6 py-2 rounded-lg font-semibold text-white transition-colors"
                    style={{ 
                      backgroundColor: '#30a7d7',
                      fontFamily: 'Flexo-Demi, arial, sans-serif'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#258fb8'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#30a7d7'}
                  >
                    Edit Pokemon
                  </Link>
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              <PokemonDescription description={displayPokemon?.description || null} />
              
              <VersionToggle
                selectedVersion={selectedVersion}
                onVersionChange={setSelectedVersion}
              />

              <PokemonInfoCard
                height={displayPokemon?.height || 0}
                weight={displayPokemon?.weight || 0}
                species={displayPokemon?.species || null}
                abilities={displayPokemon?.abilities || []}
              />

              {displayPokemon?.types && (
                <PokemonTypeSection types={displayPokemon.types} />
              )}

              {weaknesses.length > 0 && (
                <PokemonWeaknessesSection weaknesses={weaknesses} />
              )}
            </div>
          </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

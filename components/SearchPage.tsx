/**
 * Main Pokemon search interface with advanced filtering capabilities.
 * Handles search, filtering, sorting, and pagination with server-side optimization.
 */

'use client'

import React, { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';

// Component Imports
import SearchInputSection from './search/SearchInputSection';
import GreenInfoBox from './search/GreenInfoBox';
import AdvancedSearchToggle from './search/AdvancedSearchToggle';
import AdvancedSearch from './pokemon/AdvancedSearch';
import ResultsHeader from './search/ResultsHeader';
import PokemonResultsGrid from './search/PokemonResultsGrid';
import PaginationControls from './search/PaginationControls';
import { ChevronDown } from './shared/Icons';

// Hook and Query Imports
import { usePokemonFilters } from '@/hooks/usePokemonFilters';
import { POKEMONS_QUERY } from '@/lib/graphql/queries';
import type { PokemonFilters, SortOption } from '@/types';

/**
 * Main Search Page Component
 * 
 * Manages the complete search and browse experience for Pokémon.
 */
export default function PokemonSearch() {
  const router = useRouter();

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('number');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<10 | 20 | 50>(20);
  const [filters, setFilters] = useState<PokemonFilters>({});

  // Convert UI state to GraphQL-compatible format
  const { graphqlFilter, graphqlSort } = usePokemonFilters({
    searchTerm,
    filters,
    sortBy,
  });

  // Fetch Pokemon data with server-side pagination and filtering
  const { data, loading, refetch } = useQuery(POKEMONS_QUERY, {
    variables: {
      page: currentPage,
      pageSize: pageSize,
      sort: graphqlSort,
      filter: graphqlFilter,
    },
  });

  const handleReset = () => {
    setFilters({});
    setSearchTerm('');
    setCurrentPage(1);
    refetch();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: 10 | 20 | 50) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // Navigate to random Pokemon from current results
  const handleSurpriseMe = () => {
    if (pokemon.length > 0) {
      const randomIndex = Math.floor(Math.random() * pokemon.length);
      const randomPokemon = pokemon[randomIndex];
      router.push(`/pokemon/${encodeURIComponent(randomPokemon.name.toLowerCase())}`);
    }
  };

  // Extract data from GraphQL response
  const pokemon = data?.pokemons?.pokemons || [];
  const pagination = data?.pokemons?.pagination || {
    page: 1,
    pageSize: pageSize,
    totalPages: 0,
    totalCount: 0,
  };

  const handleSearchClick = () => {
    setCurrentPage(1);
    refetch();
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto " style={{ backgroundColor: 'white' }}>
        <div 
          className="flex gap-4  pb-10 px-3" 
          style={{ alignItems: 'center' , backgroundColor: '#3d3d3d'}}
        >
          <SearchInputSection
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            onSearch={handleSearchClick}
          />
          <GreenInfoBox />
        </div>
        <div className="bg-[#7F7F7F] h-10 w-full"></div>
        
        {!showAdvanced && (
          <div className="-mb-4">
            <AdvancedSearchToggle
              showAdvanced={false}
              onToggle={() => setShowAdvanced(true)}
            />
          </div>
        )}
        
        {showAdvanced && (
          <div>
            <AdvancedSearch 
              filters={filters}
              setFilters={setFilters}
              onSearch={handleSearchClick}
              onReset={handleReset}
            />
            <div className="flex justify-center -mb-4">
            <button
              onClick={() => setShowAdvanced(false)}
              className="inline-flex bg-[#7F7F7F]  rounded-t-none rounded-b-lg py-4 px-8 items-center justify-center gap-3 text-white text-lg font-semibold transition-colors relative overflow-hidden"
              style={{ fontFamily: 'Flexo-Demi, arial, sans-serif', boxShadow: 'none', minWidth: '350px' , height: '40px'}}
              aria-label="Hide Advanced Search"
              onMouseOver={(e) => {
                const cutDivs = e.currentTarget.querySelectorAll('.cut-diagonal') as NodeListOf<HTMLElement>;
                cutDivs.forEach(div => {
                  if (div.style.borderRight) div.style.borderRight = '40px solid #7F7F7F';
                  if (div.style.borderLeft) div.style.borderLeft = '40px solid #7F7F7F';
                });
              }}
              onMouseOut={(e) => {
                const cutDivs = e.currentTarget.querySelectorAll('.cut-diagonal') as NodeListOf<HTMLElement>;
                cutDivs.forEach(div => {
                  if (div.style.borderRight) div.style.borderRight = '40px solid #7F7F7F';
                  if (div.style.borderLeft) div.style.borderLeft = '40px solid #7F7F7F';
                });
              }}
            >
              <span className="relative z-10">Hide Advanced Search</span>
              <ChevronDown 
                className="transition-transform duration-200 rotate-180 w-6 h-6 relative z-10"
              />
              <div
                className="cut-diagonal"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  borderBottom: '60px solid ',
                  borderRight: '40px solid #7F7F7F',
                  width: 0,
                  height: 0,
                  transition: 'border-right 0.2s'
                }}
              />
              

              <div
                className="cut-diagonal"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  borderBottom: '60px solid ',
                  borderLeft: '40px solid #7F7F7F',
                  width: 0,
                  height: 0,
                  transition: 'border-left 0.2s'
                }}
              />
            </button>
            </div>
          </div>
        )}
      </div>

      <div className="-mt-4">
        <div className="max-w-7xl mx-auto px-6 py-8" style={{ backgroundColor: 'white' }}>
          <ResultsHeader
            onSurpriseMe={handleSurpriseMe}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
          <PokemonResultsGrid
            pokemon={pokemon}
            loading={loading}
          />
          {!loading && pagination.totalPages > 0 && (
            <PaginationControls
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              pageSize={pageSize}
              totalCount={pagination.totalCount}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}

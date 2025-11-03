/**
 * SearchPage Component
 * 
 * Main search interface for browsing and searching Pokemon.
 * Features text search, filtering, sorting, and pagination.
 */

'use client'

import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { POKEMONS_QUERY } from '@/lib/graphql/queries'
import { usePokemonFilters } from '@/hooks/usePokemonFilters'
import SearchInputSection from './search/SearchInputSection'
import PokemonResultsGrid from './search/PokemonResultsGrid'
import PaginationControls from './search/PaginationControls'

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'number' | 'name' | 'height-asc' | 'height-desc' | 'weight-asc' | 'weight-desc'>('number')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(20)
  const [filters] = useState({})

  const { graphqlFilter, graphqlSort } = usePokemonFilters({
    searchTerm,
    filters,
    sortBy,
  })

  const { data, loading, refetch } = useQuery(POKEMONS_QUERY, {
    variables: {
      page: currentPage,
      pageSize,
      sort: graphqlSort,
      filter: graphqlFilter,
    },
  })

  const pokemon = data?.pokemons?.pokemons || []
  const pagination = data?.pokemons?.pagination || {
    page: 1,
    pageSize,
    totalPages: 0,
    totalCount: 0,
  }

  const handleSearchClick = () => {
    setCurrentPage(1)
    refetch()
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'white' }}>
      <div className="max-w-7xl mx-auto">
        {/* Search Section */}
        <div 
          className="flex gap-4 pb-10 px-3" 
          style={{ alignItems: 'center', backgroundColor: '#3d3d3d' }}
        >
          <SearchInputSection
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            onSearch={handleSearchClick}
          />
        </div>
        
        <div className="bg-[#7F7F7F] h-10 w-full"></div>

        {/* Sort Controls */}
        <div className="px-3 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold" style={{ fontFamily: 'Flexo-Demi, arial, sans-serif' }}>
            Results
          </h2>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as any)
              setCurrentPage(1)
            }}
            className="px-4 py-2 rounded-lg border border-gray-300"
            style={{ fontFamily: 'Flexo-Regular, arial, sans-serif' }}
          >
            <option value="number">Pokédex Number</option>
            <option value="name">Name (A-Z)</option>
            <option value="height-asc">Height (Low to High)</option>
            <option value="height-desc">Height (High to Low)</option>
            <option value="weight-asc">Weight (Light to Heavy)</option>
            <option value="weight-desc">Weight (Heavy to Light)</option>
          </select>
        </div>

        {/* Results Grid */}
        <div className="px-3 pb-8">
          <PokemonResultsGrid pokemon={pokemon} loading={loading} />
        </div>

        {/* Pagination */}
        <PaginationControls
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={(page) => {
            setCurrentPage(page)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        />
      </div>
    </div>
  )
}


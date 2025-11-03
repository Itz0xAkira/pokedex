/**
 * usePokemonFilters Hook
 * 
 * Custom hook for managing Pokémon search filters and converting them to GraphQL format.
 * Handles converting local filter state to GraphQL FilterInput format.
 */

import { useMemo } from 'react'

/**
 * Local filter state structure
 */
export interface PokemonFilters {
  types?: string[]
  weaknesses?: string[]
  height_class?: string
  weight_class?: string
  numberMin?: string
  numberMax?: string
  ability?: string
}

interface UsePokemonFiltersProps {
  /** Search term (Pokémon name or number) */
  searchTerm: string
  /** Current filter state */
  filters: PokemonFilters
  /** Current sort option */
  sortBy: 'number' | 'name' | 'height-asc' | 'height-desc' | 'weight-asc' | 'weight-desc'
}

export function usePokemonFilters({
  searchTerm,
  filters,
  sortBy,
}: UsePokemonFiltersProps) {
  /**
   * Build GraphQL filter object from local state
   */
  const graphqlFilter = useMemo(() => {
    const filter: any = {}
    
    // Name search filter
    if (searchTerm) {
      filter.name = searchTerm
    }

    // Type filters
    if (filters.types && filters.types.length > 0) {
      filter.types = filters.types
    }

    // Weakness filters
    if (filters.weaknesses && filters.weaknesses.length > 0) {
      filter.weaknesses = filters.weaknesses
    }

    // Number range filters
    if (filters.numberMin) {
      filter.pokedexIdMin = parseInt(filters.numberMin)
    }

    if (filters.numberMax) {
      filter.pokedexIdMax = parseInt(filters.numberMax)
    }

    // Ability filter
    if (filters.ability && filters.ability !== 'All') {
      filter.ability = filters.ability
    }

    // Height class mapping
    if (filters.height_class) {
      if (filters.height_class === 'small') {
        filter.heightMax = 0.5
      } else if (filters.height_class === 'medium') {
        filter.heightMin = 0.5
        filter.heightMax = 1.5
      } else if (filters.height_class === 'large') {
        filter.heightMin = 1.5
      }
    }

    // Weight class mapping
    if (filters.weight_class) {
      if (filters.weight_class === 'light') {
        filter.weightMax = 20
      } else if (filters.weight_class === 'medium') {
        filter.weightMin = 20
        filter.weightMax = 100
      } else if (filters.weight_class === 'heavy') {
        filter.weightMin = 100
      }
    }

    return Object.keys(filter).length > 0 ? filter : undefined
  }, [searchTerm, filters])

  /**
   * Build GraphQL sort object
   */
  const graphqlSort = useMemo(() => {
    if (sortBy === 'name') {
      return { field: 'NAME', direction: 'ASC' as const }
    }
    if (sortBy === 'number') {
      return { field: 'POKEDEX_ID', direction: 'ASC' as const }
    }
    if (sortBy === 'height-asc') {
      return { field: 'HEIGHT', direction: 'ASC' as const }
    }
    if (sortBy === 'height-desc') {
      return { field: 'HEIGHT', direction: 'DESC' as const }
    }
    if (sortBy === 'weight-asc') {
      return { field: 'WEIGHT', direction: 'ASC' as const }
    }
    if (sortBy === 'weight-desc') {
      return { field: 'WEIGHT', direction: 'DESC' as const }
    }
    return { field: 'POKEDEX_ID', direction: 'ASC' as const }
  }, [sortBy])

  return {
    graphqlFilter,
    graphqlSort,
  }
}


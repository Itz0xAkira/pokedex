/**
 * GraphQL Queries
 * 
 * Centralized location for all GraphQL queries used in the application.
 * This helps maintain consistency and makes it easier to update queries.
 */

import { gql } from '@apollo/client';

/**
 * POKEMONS_QUERY
 * 
 * Fetches a paginated list of Pokémon with optional filtering and sorting.
 * 
 * Parameters:
 * - page: Page number (default: 1)
 * - pageSize: Number of items per page (default: 20)
 * - sort: Sorting configuration (field and direction)
 * - filter: Filtering options (name, types, weaknesses, height, weight, etc.)
 * 
 * Returns:
 * - pokemons: Array of Pokémon matching the criteria
 * - pagination: Pagination metadata (page, pageSize, totalPages, totalCount)
 */
export const POKEMONS_QUERY = gql`
  query Pokemons($page: Int, $pageSize: Int, $sort: SortInput, $filter: FilterInput) {
    pokemons(page: $page, pageSize: $pageSize, sort: $sort, filter: $filter) {
      pokemons {
        id
        name
        pokedexId
        height
        weight
        image
        types
        isCustom
      }
      pagination {
        page
        pageSize
        totalPages
        totalCount
      }
    }
  }
`;



/**
 * Filter and Search Type Definitions
 */

/**
 * Local filter state structure used in UI
 */
export interface PokemonFilters {
  types?: string[];
  weaknesses?: string[];
  height_class?: 'small' | 'medium' | 'large';
  weight_class?: 'light' | 'medium' | 'heavy';
  numberMin?: string;
  numberMax?: string;
  ability?: string;
}

/**
 * Sort option types
 */
export type SortOption = 
  | 'number' 
  | 'name' 
  | 'height-asc' 
  | 'height-desc' 
  | 'weight-asc' 
  | 'weight-desc';

/**
 * GraphQL sort field enum
 */
export type SortField = 'NAME' | 'POKEDEX_ID' | 'HEIGHT' | 'WEIGHT';

/**
 * GraphQL sort direction enum
 */
export type SortDirection = 'ASC' | 'DESC';

/**
 * GraphQL sort input structure
 */
export interface GraphQLSortInput {
  field: SortField;
  direction: SortDirection;
}

/**
 * GraphQL filter input structure
 */
export interface GraphQLFilterInput {
  name?: string;
  heightMin?: number;
  heightMax?: number;
  weightMin?: number;
  weightMax?: number;
  types?: string[];
  weaknesses?: string[];
  pokedexIdMin?: number;
  pokedexIdMax?: number;
  ability?: string;
}


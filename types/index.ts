/**
 * Central Type Exports
 * 
 * Re-export all types from organized modules for easy importing
 */

// Pokemon types
export type {
  Pokemon,
  PokemonListItem,
  PokemonStats,
  PokemonType,
  TypeColors,
} from './pokemon';

// User and Auth types
export type {
  User,
  AuthPayload,
  LoginInput,
  RegisterInput,
  JwtPayload,
} from './user';

// Filter and Search types
export type {
  PokemonFilters,
  SortOption,
  SortField,
  SortDirection,
  GraphQLSortInput,
  GraphQLFilterInput,
} from './filters';

// GraphQL types
export type {
  PaginationInfo,
  PokemonConnection,
  CreatePokemonInput,
  UpdatePokemonInput,
  PokemonsQueryVariables,
  PokemonQueryVariables,
  LoginMutationVariables,
  RegisterMutationVariables,
  CreatePokemonMutationVariables,
  UpdatePokemonMutationVariables,
  DeletePokemonMutationVariables,
  GraphQLContext,
} from './graphql';

// Component prop types
export type {
  PokemonCardProps,
  TypeBadgeProps,
  StatsChartProps,
  SearchInputSectionProps,
  GreenInfoBoxProps,
  AdvancedSearchToggleProps,
  AdvancedSearchProps,
  ResultsHeaderProps,
  PokemonResultsGridProps,
  PaginationControlsProps,
  NavbarProps,
  IconProps,
} from './components';

// Common types
export type {
  ApiResponse,
  PageSize,
  HeightClass,
  WeightClass,
  Callback,
  EventHandler,
} from './common';


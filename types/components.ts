/**
 * Component Prop Type Definitions
 */

import type { Pokemon, PokemonListItem, PokemonStats } from './pokemon';
import type { PokemonFilters } from './filters';
import type { SortOption } from './filters';

/**
 * PokemonCard component props
 */
export interface PokemonCardProps {
  pokemon: PokemonListItem;
}

/**
 * TypeBadge component props
 */
export interface TypeBadgeProps {
  type: string;
  className?: string;
}

/**
 * StatsChart component props
 */
export interface StatsChartProps {
  stats: PokemonStats | null | undefined;
}

/**
 * SearchInputSection component props
 */
export interface SearchInputSectionProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onSearch: () => void;
}

/**
 * GreenInfoBox component props
 * (Currently no props needed, but defined for consistency)
 */
export interface GreenInfoBoxProps {}

/**
 * AdvancedSearchToggle component props
 */
export interface AdvancedSearchToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * AdvancedSearch component props
 */
export interface AdvancedSearchProps {
  filters: PokemonFilters;
  setFilters: (filters: PokemonFilters | ((prev: PokemonFilters) => PokemonFilters)) => void;
  onSearch: () => void;
  onReset: () => void;
}

/**
 * ResultsHeader component props
 */
export interface ResultsHeaderProps {
  onSurpriseMe: () => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
}

/**
 * PokemonResultsGrid component props
 */
export interface PokemonResultsGridProps {
  pokemon: Pokemon[];
  loading: boolean;
}

/**
 * PaginationControls component props
 */
export interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  pageSize: 10 | 20 | 50;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: 10 | 20 | 50) => void;
}

/**
 * Navbar component props
 * (Currently no props needed, but defined for consistency)
 */
export interface NavbarProps {}

/**
 * Icon component props (shared across all icons)
 */
export interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}


/**
 * GraphQL API Type Definitions
 */

import { Pokemon, PokemonStats } from './pokemon';
import { User, LoginInput, RegisterInput, AuthPayload } from './user';
import { GraphQLFilterInput, GraphQLSortInput } from './filters';

/**
 * Pagination information
 */
export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
}

/**
 * Pokemon connection with pagination
 */
export interface PokemonConnection {
  pokemons: Pokemon[];
  pagination: PaginationInfo;
}

/**
 * Create Pokemon input structure
 */
export interface CreatePokemonInput {
  name: string;
  height: number;
  weight: number;
  image?: string;
  types?: string[];
  abilities?: string[];
  baseStats?: PokemonStats;
  description?: string;
  species?: string;
}

/**
 * Update Pokemon input structure
 */
export interface UpdatePokemonInput {
  id: string;
  name?: string;
  height?: number;
  weight?: number;
  image?: string;
  types?: string[];
  abilities?: string[];
  baseStats?: PokemonStats;
  description?: string;
  species?: string;
}

/**
 * GraphQL Query/Mutation types
 */
export interface PokemonsQueryVariables {
  page?: number;
  pageSize?: number;
  sort?: GraphQLSortInput;
  filter?: GraphQLFilterInput;
}

export interface PokemonQueryVariables {
  id: string;
}

export interface LoginMutationVariables {
  input: LoginInput;
}

export interface RegisterMutationVariables {
  input: RegisterInput;
}

export interface CreatePokemonMutationVariables {
  input: CreatePokemonInput;
}

export interface UpdatePokemonMutationVariables {
  input: UpdatePokemonInput;
}

export interface DeletePokemonMutationVariables {
  id: string;
}

import { PrismaClient } from '@prisma/client';
import { PokemonStats } from './pokemon';

/**
 * GraphQL Context type
 */
export interface GraphQLContext {
  prisma: PrismaClient;
  userId?: string;
  userEmail?: string;
}

/**
 * GraphQL Resolver Parent Types
 */
export interface PokemonResolverParent {
  id: string;
  name: string;
  pokedexId: number | null;
  height: number;
  weight: number;
  image: string | null;
  imageShiny: string | null;
  types: string[];
  abilities: string[];
  baseStats: PokemonStats | string | null; // Can be JSON string from DB or parsed object
  description: string | null;
  species: string | null;
  isCustom: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdByUserId: string | null;
}

/**
 * Prisma WhereInput type for Pokemon queries
 */
export type PokemonWhereInput = {
  name?: { contains: string; mode?: 'insensitive' };
  height?: { gte?: number; lte?: number };
  weight?: { gte?: number; lte?: number };
  types?: { hasEvery?: string[]; hasSome?: string[] };
  abilities?: { has?: string };
  pokedexId?: { gte?: number; lte?: number };
  AND?: PokemonWhereInput[];
  OR?: PokemonWhereInput[];
};

/**
 * Prisma OrderByInput type for Pokemon sorting
 */
export type PokemonOrderByInput = {
  name?: 'asc' | 'desc';
  pokedexId?: 'asc' | 'desc';
  height?: 'asc' | 'desc';
  weight?: 'asc' | 'desc';
};

/**
 * Prisma Pokemon UpdateInput type
 */
export type PokemonUpdateInput = {
  name?: string;
  height?: number;
  weight?: number;
  image?: string | null;
  types?: string[];
  abilities?: string[];
  baseStats?: PokemonStats | null;
  description?: string | null;
  species?: string | null;
};


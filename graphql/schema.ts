/**
 * GraphQL Schema Definition
 * 
 * This file defines all types, queries, mutations, and inputs for the Pokemon API.
 * This is the foundation of our GraphQL API - all resolvers will implement these types.
 */

import { gql } from 'graphql-tag'

export const typeDefs = gql`
  # User Type
  type User {
    id: ID!
    email: String!
    createdAt: String!
  }

  # Pokemon Stats Type
  type PokemonStats {
    hp: Int
    attack: Int
    defense: Int
    spAttack: Int
    spDefense: Int
    speed: Int
  }

  # Pokemon Type
  type Pokemon {
    id: ID!
    name: String!
    pokedexId: Int
    height: Float!
    weight: Float!
    image: String
    imageShiny: String
    types: [String!]!
    abilities: [String!]!
    baseStats: PokemonStats
    description: String
    species: String
    isCustom: Boolean!
    createdByUserId: String
    createdAt: String!
    updatedAt: String!
  }

  # Pagination Types
  type PaginationInfo {
    page: Int!
    pageSize: Int!
    totalPages: Int!
    totalCount: Int!
  }

  type PokemonConnection {
    pokemons: [Pokemon!]!
    pagination: PaginationInfo!
  }

  # Sorting Inputs
  input SortInput {
    field: SortField!
    direction: SortDirection!
  }

  enum SortField {
    NAME
    POKEDEX_ID
    HEIGHT
    WEIGHT
  }

  enum SortDirection {
    ASC
    DESC
  }

  # Filter Inputs
  input FilterInput {
    name: String
    heightMin: Float
    heightMax: Float
    weightMin: Float
    weightMax: Float
    types: [String!]
    weaknesses: [String!]
    pokedexIdMin: Int
    pokedexIdMax: Int
    ability: String
  }

  # Authentication Inputs
  input LoginInput {
    email: String!
    password: String!
  }

  input RegisterInput {
    email: String!
    password: String!
  }

  # Pokemon CRUD Inputs
  input CreatePokemonInput {
    name: String!
    height: Float!
    weight: Float!
    image: String
    imageShiny: String
    types: [String!]
    abilities: [String!]
    baseStats: PokemonStatsInput
    description: String
    species: String
  }

  input PokemonStatsInput {
    hp: Int
    attack: Int
    defense: Int
    spAttack: Int
    spDefense: Int
    speed: Int
  }

  input UpdatePokemonInput {
    id: ID!
    name: String
    height: Float
    weight: Float
    image: String
    types: [String!]
    abilities: [String!]
    baseStats: PokemonStatsInput
    description: String
    species: String
  }

  # Authentication Response
  type AuthPayload {
    token: String!
    user: User!
  }

  # Queries
  type Query {
    # Get paginated list of Pokemon with filtering and sorting
    pokemons(
      page: Int = 1
      pageSize: Int = 20
      sort: SortInput
      filter: FilterInput
    ): PokemonConnection!
    
    # Get a single Pokemon by ID, pokedexId, or name
    pokemon(id: ID, pokedexId: Int, name: String): Pokemon
    
    # Get current authenticated user
    me: User
  }

  # Mutations
  type Mutation {
    # User authentication
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    
    # Pokemon CRUD operations
    createPokemon(input: CreatePokemonInput!): Pokemon!
    updatePokemon(input: UpdatePokemonInput!): Pokemon!
    deletePokemon(id: ID!): Boolean!
  }
`


import { gql } from 'graphql-tag'

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    createdAt: String!
  }

  type PokemonStats {
    hp: Int
    attack: Int
    defense: Int
    spAttack: Int
    spDefense: Int
    speed: Int
  }

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

  input LoginInput {
    email: String!
    password: String!
  }

  input RegisterInput {
    email: String!
    password: String!
  }

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

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    pokemons(
      page: Int = 1
      pageSize: Int = 20
      sort: SortInput
      filter: FilterInput
    ): PokemonConnection!
    pokemon(id: ID, pokedexId: Int, name: String): Pokemon
    me: User
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    createPokemon(input: CreatePokemonInput!): Pokemon!
    updatePokemon(input: UpdatePokemonInput!): Pokemon!
    deletePokemon(id: ID!): Boolean!
  }
`

/**
 * Pokemon Detail Page GraphQL Queries
 */

import { gql } from '@apollo/client'

export const POKEMON_QUERY = gql`
  query Pokemon($name: String) {
    pokemon(name: $name) {
      id
      name
      pokedexId
      height
      weight
      image
      imageShiny
      types
      abilities
      baseStats {
        hp
        attack
        defense
        spAttack
        spDefense
        speed
      }
      description
      species
      isCustom
      createdByUserId
    }
  }
`

export const POKEMONS_LIST_QUERY = gql`
  query Pokemons($page: Int, $pageSize: Int, $sort: SortInput) {
    pokemons(page: $page, pageSize: $pageSize, sort: $sort) {
      pokemons {
        id
        name
        pokedexId
      }
    }
  }
`

export const CREATE_POKEMON_MUTATION = gql`
  mutation CreatePokemon($input: CreatePokemonInput!) {
    createPokemon(input: $input) {
      id
      name
      pokedexId
      height
      weight
      image
      imageShiny
      types
      abilities
      baseStats {
        hp
        attack
        defense
        spAttack
        spDefense
        speed
      }
      description
      species
      isCustom
    }
  }
`

export const UPDATE_POKEMON_MUTATION = gql`
  mutation UpdatePokemon($input: UpdatePokemonInput!) {
    updatePokemon(input: $input) {
      id
      name
      pokedexId
      height
      weight
      image
      types
      abilities
      baseStats {
        hp
        attack
        defense
        spAttack
        spDefense
        speed
      }
      description
      species
    }
  }
`

export const DELETE_POKEMON_MUTATION = gql`
  mutation DeletePokemon($id: ID!) {
    deletePokemon(id: $id)
  }
`


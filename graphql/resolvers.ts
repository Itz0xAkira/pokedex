/**
 * GraphQL Resolvers
 * 
 * Implements all resolvers for queries and mutations.
 * Handles authentication, authorization, and data operations.
 */

import { GraphQLContext } from './context'
import { hashPassword, verifyPassword, getUserByEmail } from '@/lib/auth'
import { generateToken } from '@/lib/jwt'
import type { Prisma } from '@prisma/client'

// Pokemon baseStats field resolver - converts JSON to object
export const resolvers = {
  Pokemon: {
    baseStats: (parent: any): any => {
      if (!parent.baseStats) return null
      return typeof parent.baseStats === 'string' 
        ? JSON.parse(parent.baseStats) 
        : parent.baseStats
    },
  },

  Query: {
    pokemons: async (
      _: unknown,
      args: {
        page?: number
        pageSize?: number
        sort?: { field: 'NAME' | 'POKEDEX_ID' | 'HEIGHT' | 'WEIGHT'; direction: 'ASC' | 'DESC' }
        filter?: {
          name?: string
          heightMin?: number
          heightMax?: number
          weightMin?: number
          weightMax?: number
          types?: string[]
          weaknesses?: string[]
          pokedexIdMin?: number
          pokedexIdMax?: number
          ability?: string
        }
      },
      context: GraphQLContext
    ) => {
      const { page = 1, pageSize = 20, sort, filter } = args
      const skip = (page - 1) * pageSize

      // Build where clause
      const where: Prisma.PokemonWhereInput = {}
      
      if (filter?.name) {
        where.name = {
          contains: filter.name,
          mode: 'insensitive',
        }
      }

      if (filter?.heightMin !== undefined || filter?.heightMax !== undefined) {
        where.height = {}
        if (filter.heightMin !== undefined) {
          where.height.gte = filter.heightMin
        }
        if (filter.heightMax !== undefined) {
          where.height.lte = filter.heightMax
        }
      }

      if (filter?.weightMin !== undefined || filter?.weightMax !== undefined) {
        where.weight = {}
        if (filter.weightMin !== undefined) {
          where.weight.gte = filter.weightMin
        }
        if (filter.weightMax !== undefined) {
          where.weight.lte = filter.weightMax
        }
      }

      // Handle types filter
      if (filter?.types && filter.types.length > 0) {
        where.types = {
          hasEvery: filter.types,
        }
      }

      // Handle weaknesses filter
      // Note: Since we don't store weaknesses in the DB, this is a simplified implementation
      // In a real scenario, you'd need to compute weaknesses from types or store them separately
      // For now, we'll skip this filter as we can't compute weaknesses without type effectiveness data
      if (filter?.weaknesses && filter.weaknesses.length > 0) {
        // Weaknesses filtering would require type effectiveness calculations
        // This is a placeholder - actual implementation would need type chart data
      }

      if (filter?.pokedexIdMin !== undefined || filter?.pokedexIdMax !== undefined) {
        where.pokedexId = {}
        if (filter.pokedexIdMin !== undefined) {
          where.pokedexId.gte = filter.pokedexIdMin
        }
        if (filter.pokedexIdMax !== undefined) {
          where.pokedexId.lte = filter.pokedexIdMax
        }
      }

      if (filter?.ability) {
        where.abilities = {
          has: filter.ability,
        }
      }

      // Build orderBy clause
      let orderBy: Prisma.PokemonOrderByWithRelationInput = { name: 'asc' }
      if (sort) {
        const fieldMap: Record<string, string> = {
          NAME: 'name',
          POKEDEX_ID: 'pokedexId',
          HEIGHT: 'height',
          WEIGHT: 'weight',
        }
        const direction = sort.direction.toLowerCase() as 'asc' | 'desc'
        orderBy = {
          [fieldMap[sort.field]]: direction,
        }
      }

      const [pokemons, totalCount] = await Promise.all([
        context.prisma.pokemon.findMany({
          where,
          orderBy,
          skip,
          take: pageSize,
        }),
        context.prisma.pokemon.count({ where }),
      ])

      const totalPages = Math.ceil(totalCount / pageSize)

      return {
        pokemons,
        pagination: {
          page,
          pageSize,
          totalPages,
          totalCount,
        },
      }
    },

    pokemon: async (
      _: unknown, 
      args: { id?: string | null; pokedexId?: number | null; name?: string | null },
      context: GraphQLContext
    ) => {
      // Query by name (preferred method for URLs)
      if (args.name != null) {
        return context.prisma.pokemon.findUnique({
          where: { name: args.name },
        })
      }
      // Query by pokedexId
      if (args.pokedexId != null) {
        return context.prisma.pokemon.findUnique({
          where: { pokedexId: args.pokedexId },
        })
      }
      // Fallback to CUID id for custom Pokemon or backward compatibility
      if (args.id != null) {
        return context.prisma.pokemon.findUnique({
          where: { id: args.id },
        })
      }
      return null
    },

    me: async (_: unknown, __: unknown, context: GraphQLContext) => {
      if (!context.userId) {
        return null
      }
      const user = await context.prisma.user.findUnique({
        where: { id: context.userId },
      })
      return user ? {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
      } : null
    },
  },

  Mutation: {
    register: async (_: unknown, args: { input: { email: string; password: string } }, context: GraphQLContext) => {
      const { email, password } = args.input

      // Check if user already exists
      const existingUser = await getUserByEmail(email)
      if (existingUser) {
        throw new Error('User with this email already exists')
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(password)
      const user = await context.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      })

      const token = generateToken({ userId: user.id, email: user.email })

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt.toISOString(),
        },
      }
    },

    login: async (_: unknown, args: { input: { email: string; password: string } }, context: GraphQLContext) => {
      const { email, password } = args.input

      const user = await getUserByEmail(email)
      if (!user) {
        throw new Error('Invalid email or password')
      }

      const isValid = await verifyPassword(password, user.password)
      if (!isValid) {
        throw new Error('Invalid email or password')
      }

      const token = generateToken({ userId: user.id, email: user.email })

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt.toISOString(),
        },
      }
    },

    createPokemon: async (
      _: unknown,
      args: { 
        input: {
          name: string
          height: number
          weight: number
          image?: string | null
          imageShiny?: string | null
          types?: string[] | null
          abilities?: string[] | null
          baseStats?: {
            hp?: number | null
            attack?: number | null
            defense?: number | null
            spAttack?: number | null
            spDefense?: number | null
            speed?: number | null
          } | null
          description?: string | null
          species?: string | null
        }
      },
      context: GraphQLContext
    ) => {
      if (!context.userId) {
        throw new Error('Authentication required')
      }

      const { name, height, weight, image, imageShiny, types, abilities, baseStats, description, species } = args.input

      // Check if Pokemon with this name already exists
      const existing = await context.prisma.pokemon.findUnique({
        where: { name },
      })
      if (existing) {
        throw new Error('Pokemon with this name already exists')
      }

      // Find the highest pokedexId and add 1
      // If no Pokemon exist, start at 1
      const lastPokemon = await context.prisma.pokemon.findFirst({
        where: {
          pokedexId: { not: null }
        },
        orderBy: {
          pokedexId: 'desc'
        },
        select: {
          pokedexId: true
        }
      })

      const nextPokedexId = lastPokemon?.pokedexId ? lastPokemon.pokedexId + 1 : 1

      const pokemon = await context.prisma.pokemon.create({
        data: {
          name,
          height,
          weight,
          image: image || null,
          imageShiny: imageShiny || null,
          pokedexId: nextPokedexId,
          types: types || [],
          abilities: abilities || [],
          baseStats: baseStats || null,
          description: description || null,
          species: species || null,
          isCustom: true,
          createdByUserId: context.userId, // Track ownership for authorization
        },
      })

      return pokemon
    },

    updatePokemon: async (
      _: unknown,
      args: { 
        input: {
          id: string
          name?: string | null
          height?: number | null
          weight?: number | null
          image?: string | null
          types?: string[] | null
          abilities?: string[] | null
          baseStats?: {
            hp?: number | null
            attack?: number | null
            defense?: number | null
            spAttack?: number | null
            spDefense?: number | null
            speed?: number | null
          } | null
          description?: string | null
          species?: string | null
        }
      },
      context: GraphQLContext
    ) => {
      if (!context.userId) {
        throw new Error('Authentication required')
      }

      const { id, ...updateData } = args.input

      // Check if Pokemon exists
      const existing = await context.prisma.pokemon.findUnique({
        where: { id },
      })
      if (!existing) {
        throw new Error('Pokemon not found')
      }

      // Authorization check: Only allow updating custom Pokemon created by the current user
      if (existing.isCustom && existing.createdByUserId !== context.userId) {
        throw new Error('Not authorized to modify this Pokemon')
      }
      // Non-custom Pokemon (from API) cannot be modified
      if (!existing.isCustom) {
        throw new Error('Cannot modify official Pokemon')
      }

      // If name is being updated, check for conflicts
      if (updateData.name && updateData.name !== existing.name) {
        const nameConflict = await context.prisma.pokemon.findUnique({
          where: { name: updateData.name },
        })
        if (nameConflict) {
          throw new Error('Pokemon with this name already exists')
        }
      }

      // Build update data, handling arrays and JSON properly
      const data: Prisma.PokemonUpdateInput = {}
      if (updateData.name !== undefined) data.name = updateData.name
      if (updateData.height !== undefined) data.height = updateData.height
      if (updateData.weight !== undefined) data.weight = updateData.weight
      if (updateData.image !== undefined) data.image = updateData.image
      if (updateData.types !== undefined) data.types = updateData.types
      if (updateData.abilities !== undefined) data.abilities = updateData.abilities
      if (updateData.baseStats !== undefined) data.baseStats = updateData.baseStats
      if (updateData.description !== undefined) data.description = updateData.description
      if (updateData.species !== undefined) data.species = updateData.species

      return context.prisma.pokemon.update({
        where: { id },
        data,
      })
    },

    deletePokemon: async (_: unknown, args: { id: string }, context: GraphQLContext) => {
      if (!context.userId) {
        throw new Error('Authentication required')
      }

      const pokemon = await context.prisma.pokemon.findUnique({
        where: { id: args.id },
      })
      if (!pokemon) {
        throw new Error('Pokemon not found')
      }

      // Authorization check: Only allow deleting custom Pokemon created by the current user
      if (pokemon.isCustom && pokemon.createdByUserId !== context.userId) {
        throw new Error('Not authorized to delete this Pokemon')
      }
      // Non-custom Pokemon (from API) cannot be deleted
      if (!pokemon.isCustom) {
        throw new Error('Cannot delete official Pokemon')
      }

      await context.prisma.pokemon.delete({
        where: { id: args.id },
      })

      return true
    },
  },
}


import { Context } from './context'
import { hashPassword, verifyPassword, getUserByEmail } from '@/lib/auth'
import { generateToken } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import type { 
  PokemonResolverParent, 
  PokemonWhereInput, 
  PokemonOrderByInput,
  PokemonUpdateInput,
  CreatePokemonInput,
  UpdatePokemonInput,
} from '@/types/graphql'
import type { PokemonStats } from '@/types/pokemon'

export const resolvers = {
  Pokemon: {
    // Transform baseStats from JSON string to object for GraphQL response
    baseStats: (parent: PokemonResolverParent): PokemonStats | null => {
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
        page: number
        pageSize: number
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
      }
    ) => {
      const { page = 1, pageSize = 20, sort, filter } = args
      const skip = (page - 1) * pageSize

      // Build dynamic where clause based on filters
      const where: PokemonWhereInput = {}
      
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

      if (filter?.types && filter.types.length > 0) {
        where.types = {
          hasEvery: filter.types,
        }
      }

      // TODO: Implement weakness calculation from type effectiveness tables
      if (filter?.weaknesses && filter.weaknesses.length > 0 && (!filter?.types || filter.types.length === 0)) {
        // Placeholder for weakness filtering - requires type effectiveness computation
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

      // Map GraphQL sort fields to Prisma field names
      let orderBy: PokemonOrderByInput = { name: 'asc' }
      if (sort) {
        const fieldMap: Record<string, string> = {
          NAME: 'name',
          POKEDEX_ID: 'pokedexId',
          HEIGHT: 'height',
          WEIGHT: 'weight',
        }
        orderBy = {
          [fieldMap[sort.field]]: sort.direction.toLowerCase(),
        }
      }

      // Execute paginated query and count in parallel for performance
      const [pokemons, totalCount] = await Promise.all([
        prisma.pokemon.findMany({
          where,
          orderBy,
          skip,
          take: pageSize,
        }),
        prisma.pokemon.count({ where }),
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

    // Flexible Pokemon lookup by name (preferred), pokedexId, or internal ID
    pokemon: async (_: unknown, args: { id?: string | null; pokedexId?: number | null; name?: string | null }) => {
      if (args.name != null) {
        return prisma.pokemon.findUnique({
          where: { name: args.name },
        })
      }
      if (args.pokedexId != null) {
        return prisma.pokemon.findUnique({
          where: { pokedexId: args.pokedexId },
        })
      }
      if (args.id != null) {
        return prisma.pokemon.findUnique({
          where: { id: args.id },
        })
      }
      return null
    },

    me: async (_: unknown, __: unknown, context: Context) => {
      if (!context.userId) {
        return null
      }
      return prisma.user.findUnique({
        where: { id: context.userId },
      })
    },
  },

  Mutation: {
    register: async (_: unknown, args: { input: { email: string; password: string } }) => {
      const { email, password } = args.input

      const existingUser = await getUserByEmail(email)
      if (existingUser) {
        throw new Error('User with this email already exists')
      }
      const hashedPassword = await hashPassword(password)
      const user = await prisma.user.create({
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

    login: async (_: unknown, args: { input: { email: string; password: string } }) => {
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
        input: CreatePokemonInput & {
          imageShiny?: string
        }
      },
      context: Context
    ) => {
      if (!context.userId) {
        throw new Error('Authentication required')
      }

      const { name, height, weight, image, imageShiny, types, abilities, baseStats, description, species } = args.input

      const existing = await prisma.pokemon.findUnique({
        where: { name },
      })
      if (existing) {
        throw new Error('Pokemon with this name already exists')
      }
      const lastPokemon = await prisma.pokemon.findFirst({
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

      // Auto-increment Pokedex ID for new custom Pokemon
      const nextPokedexId = lastPokemon?.pokedexId ? lastPokemon.pokedexId + 1 : 1

      return prisma.pokemon.create({
        data: {
          name,
          height,
          weight,
          image,
          imageShiny,
          pokedexId: nextPokedexId,
          types: types || [],
          abilities: abilities || [],
          baseStats: baseStats ? (baseStats as Prisma.InputJsonValue) : Prisma.JsonNull,
          description,
          species,
          isCustom: true,
          createdByUserId: context.userId, // Track ownership for edit/delete permissions // Track ownership for authorization
        },
      })
    },

    updatePokemon: async (
      _: unknown,
      args: { 
        input: UpdatePokemonInput
      },
      context: Context
    ) => {
      if (!context.userId) {
        throw new Error('Authentication required')
      }

      const { id, ...updateData } = args.input

      const existing = await prisma.pokemon.findUnique({
        where: { id },
      })
      if (!existing) {
        throw new Error('Pokemon not found')
      }

      if (existing.isCustom && existing.createdByUserId !== context.userId) {
        throw new Error('Not authorized to modify this Pokemon')
      }
      if (!existing.isCustom) {
        throw new Error('Cannot modify official Pokemon')
      }
      if (updateData.name && updateData.name !== existing.name) {
        const nameConflict = await prisma.pokemon.findUnique({
          where: { name: updateData.name },
        })
        if (nameConflict) {
          throw new Error('Pokemon with this name already exists')
        }
      }

      const data: any = {}
      if (updateData.name !== undefined) data.name = updateData.name
      if (updateData.height !== undefined) data.height = updateData.height
      if (updateData.weight !== undefined) data.weight = updateData.weight
      if (updateData.image !== undefined) data.image = updateData.image
      if (updateData.types !== undefined) data.types = updateData.types
      if (updateData.abilities !== undefined) data.abilities = updateData.abilities
      if (updateData.baseStats !== undefined) {
        data.baseStats = updateData.baseStats ? (updateData.baseStats as Prisma.InputJsonValue) : Prisma.JsonNull
      }
      if (updateData.description !== undefined) data.description = updateData.description
      if (updateData.species !== undefined) data.species = updateData.species

      return prisma.pokemon.update({
        where: { id },
        data,
      })
    },

    deletePokemon: async (_: unknown, args: { id: string }, context: Context) => {
      if (!context.userId) {
        throw new Error('Authentication required')
      }

      const pokemon = await prisma.pokemon.findUnique({
        where: { id: args.id },
      })
      if (!pokemon) {
        throw new Error('Pokemon not found')
      }

      if (pokemon.isCustom && pokemon.createdByUserId !== context.userId) {
        throw new Error('Not authorized to delete this Pokemon')
      }
      if (!pokemon.isCustom) {
        throw new Error('Cannot delete official Pokemon')
      }

      await prisma.pokemon.delete({
        where: { id: args.id },
      })

      return true
    },
  },
}


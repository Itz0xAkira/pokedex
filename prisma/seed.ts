import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface PokeAPIPokemon {
  id: number
  name: string
  height: number
  weight: number
  sprites: {
    other: {
      'official-artwork': {
        front_default: string | null
        front_shiny: string | null
      }
    }
  }
  types: Array<{
    type: {
      name: string
    }
  }>
  abilities: Array<{
    ability: {
      name: string
    }
  }>
  stats: Array<{
    base_stat: number
    stat: {
      name: string
    }
  }>
  species: {
    url: string
  }
}

interface PokeAPISpecies {
  flavor_text_entries: Array<{
    flavor_text: string
    language: {
      name: string
    }
    version: {
      name: string
    }
  }>
  genera: Array<{
    genus: string
    language: {
      name: string
    }
  }>
}

async function fetchPokemonSpecies(speciesUrl: string): Promise<{ description: string | null; species: string | null }> {
  try {
    const response = await fetch(speciesUrl)
    if (!response.ok) return { description: null, species: null }
    
    const speciesData: PokeAPISpecies = await response.json()
    
    // Get English flavor text (prefer latest version)
    const englishFlavorText = speciesData.flavor_text_entries
      .filter(entry => entry.language.name === 'en')
      .sort((a, b) => a.version.name.localeCompare(b.version.name))
      .pop()?.flavor_text
    
    // Get English genus
    const englishGenus = speciesData.genera
      .find(genus => genus.language.name === 'en')
      ?.genus
    
    return {
      description: englishFlavorText ? englishFlavorText.replace(/\f/g, ' ').replace(/\n/g, ' ') : null,
      species: englishGenus || null,
    }
  } catch (error) {
    return { description: null, species: null }
  }
}

async function fetchPokemonFromAPI(limit: number = 151): Promise<void> {
  console.log(`🌐 Fetching Pokemon data from PokeAPI (first ${limit} Pokemon)...`)
  
  try {
    // Fetch list of Pokemon (pagination)
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon list: ${response.statusText}`)
    }
    
    const data = await response.json()
    const pokemonList = data.results
    
    console.log(`📦 Found ${pokemonList.length} Pokemon to fetch`)
    
    let successCount = 0
    let errorCount = 0
    
    // Fetch details for each Pokemon
    for (let i = 0; i < pokemonList.length; i++) {
      const pokemon = pokemonList[i]
      
      try {
        console.log(`  [${i + 1}/${pokemonList.length}] Fetching ${pokemon.name}...`)
        
        // Fetch Pokemon details
        const detailResponse = await fetch(pokemon.url)
        if (!detailResponse.ok) {
          throw new Error(`Failed to fetch ${pokemon.name}: ${detailResponse.statusText}`)
        }
        
        const pokemonData: PokeAPIPokemon = await detailResponse.json()
        
        // Convert height from decimeters to meters, weight from hectograms to kilograms
        const height = pokemonData.height / 10
        const weight = pokemonData.weight / 10
        const image = pokemonData.sprites?.other?.['official-artwork']?.front_default || null
        const imageShiny = pokemonData.sprites?.other?.['official-artwork']?.front_shiny || null
        
        // Extract types
        const types = pokemonData.types.map(t => 
          t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)
        )
        
        // Extract abilities
        const abilities = pokemonData.abilities.map(a => 
          a.ability.name.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')
        )
        
        // Extract stats
        const stats: Record<string, number> = {}
        pokemonData.stats.forEach(stat => {
          const statName = stat.stat.name
          if (statName === 'hp') {
            stats.hp = stat.base_stat
          } else if (statName === 'attack') {
            stats.attack = stat.base_stat
          } else if (statName === 'defense') {
            stats.defense = stat.base_stat
          } else if (statName === 'special-attack') {
            stats.spAttack = stat.base_stat
          } else if (statName === 'special-defense') {
            stats.spDefense = stat.base_stat
          } else if (statName === 'speed') {
            stats.speed = stat.base_stat
          }
        })
        
        // Fetch species data for description
        const { description, species } = await fetchPokemonSpecies(pokemonData.species.url)
        
        const baseStatsValue = Object.keys(stats).length > 0 ? stats : undefined
        
        await prisma.pokemon.upsert({
          where: { name: pokemonData.name },
          update: {
            pokedexId: pokemonData.id,
            height,
            weight,
            image,
            imageShiny,
            types,
            abilities,
            baseStats: baseStatsValue as any,
            description,
            species,
          },
          create: {
            name: pokemonData.name,
            pokedexId: pokemonData.id,
            height,
            weight,
            image,
            imageShiny,
            types,
            abilities,
            baseStats: baseStatsValue as any,
            description,
            species,
            isCustom: false,
          },
        })
        
        successCount++
        
        // Add a small delay to be respectful to the API
        if (i < pokemonList.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 150))
        }
      } catch (error) {
        console.error(`  ❌ Error fetching ${pokemon.name}:`, error instanceof Error ? error.message : error)
        errorCount++
      }
    }
    
    console.log(`\n✅ Successfully fetched ${successCount} Pokemon`)
    if (errorCount > 0) {
      console.log(`⚠️  ${errorCount} Pokemon failed to fetch`)
    }
  } catch (error) {
    console.error('❌ Error fetching Pokemon list:', error instanceof Error ? error.message : error)
    throw error
  }
}

async function main() {
  console.log('🚀 Starting Pokemon database seed...\n')
  
  // Check if we already have Pokemon in the database
  const existingCount = await prisma.pokemon.count()
  
  if (existingCount > 0) {
    console.log(`ℹ️  Database already contains ${existingCount} Pokemon`)
    console.log('   Skipping seed to avoid duplicates.')
    console.log('   To re-seed, delete all Pokemon from the database first.\n')
    return
  }
  
  // Fetch first 151 Pokemon (original generation)
  await fetchPokemonFromAPI(151)
  
  console.log('\n✅ Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

/**
 * Edit Pokémon Page
 * 
 * Page for editing existing custom Pokémon entries.
 * Only accessible for custom Pokemon owned by the logged-in user.
 */

'use client'

import { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { POKEMON_QUERY } from '@/lib/graphql/pokemon-queries'
import { UPDATE_POKEMON_MUTATION } from '@/lib/graphql/pokemon-queries'
import { gql } from '@apollo/client'

const ME_QUERY = gql`
  query Me {
    me {
      id
      email
    }
  }
`

const POKEMON_TYPES = [
  'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice',
  'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug',
  'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'
] as const

export default function EditPokemonPage() {
  const router = useRouter()
  const params = useParams()
  const pokemonName = params.id as string
  
  // Check authentication
  const { data: userData } = useQuery(ME_QUERY, {
    errorPolicy: 'ignore',
  })
  
  // Fetch Pokemon data
  const { data: pokemonData, loading: pokemonLoading } = useQuery(POKEMON_QUERY, {
    variables: { name: pokemonName },
    skip: !pokemonName,
  })
  
  const pokemon = pokemonData?.pokemon
  
  // Basic Info
  const [name, setName] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [species, setSpecies] = useState('')
  const [description, setDescription] = useState('')
  
  // Images
  const [image, setImage] = useState('')
  
  // Types & Abilities
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [abilities, setAbilities] = useState<string[]>([''])
  
  // Base Stats
  const [hp, setHp] = useState('')
  const [attack, setAttack] = useState('')
  const [defense, setDefense] = useState('')
  const [spAttack, setSpAttack] = useState('')
  const [spDefense, setSpDefense] = useState('')
  const [speed, setSpeed] = useState('')
  
  const [error, setError] = useState('')

  // Load Pokemon data into form
  useEffect(() => {
    if (pokemon) {
      setName(pokemon.name || '')
      setHeight(pokemon.height?.toString() || '')
      setWeight(pokemon.weight?.toString() || '')
      setSpecies(pokemon.species || '')
      setDescription(pokemon.description || '')
      setImage(pokemon.image || '')
      setSelectedTypes(pokemon.types || [])
      setAbilities(pokemon.abilities?.length > 0 ? pokemon.abilities : [''])
      
      if (pokemon.baseStats) {
        setHp(pokemon.baseStats.hp?.toString() || '')
        setAttack(pokemon.baseStats.attack?.toString() || '')
        setDefense(pokemon.baseStats.defense?.toString() || '')
        setSpAttack(pokemon.baseStats.spAttack?.toString() || '')
        setSpDefense(pokemon.baseStats.spDefense?.toString() || '')
        setSpeed(pokemon.baseStats.speed?.toString() || '')
      }
    }
  }, [pokemon])

  const [updatePokemon, { loading }] = useMutation(UPDATE_POKEMON_MUTATION)

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const addAbility = () => {
    setAbilities(prev => [...prev, ''])
  }

  const removeAbility = (index: number) => {
    setAbilities(prev => prev.filter((_, i) => i !== index))
  }

  const updateAbility = (index: number, value: string) => {
    setAbilities(prev => prev.map((ability, i) => i === index ? value : ability))
  }

  // Show loading or error if Pokemon not found or not custom
  if (pokemonLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-7xl mx-auto w-full" style={{ backgroundColor: 'white' }}>
          <div className="px-6 py-8">
            <div className="text-xl text-gray-900">Loading...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!pokemon) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-7xl mx-auto w-full" style={{ backgroundColor: 'white' }}>
          <div className="px-6 py-8">
            <div className="text-xl text-gray-900">Pokemon not found</div>
          </div>
        </div>
      </div>
    )
  }

  if (!pokemon.isCustom) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-7xl mx-auto w-full" style={{ backgroundColor: 'white' }}>
          <div className="px-6 py-8">
            <div className="text-xl text-gray-900">Cannot edit official Pokemon</div>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name || !height || !weight) {
      setError('Please fill in all required fields (Name, Height, Weight)')
      return
    }

    // Filter out empty abilities
    const filteredAbilities = abilities.filter(ability => ability.trim() !== '')

    // Build baseStats object if at least one stat is provided
    const baseStats: { hp?: number; attack?: number; defense?: number; spAttack?: number; spDefense?: number; speed?: number } = {}
    if (hp) baseStats.hp = parseInt(hp)
    if (attack) baseStats.attack = parseInt(attack)
    if (defense) baseStats.defense = parseInt(defense)
    if (spAttack) baseStats.spAttack = parseInt(spAttack)
    if (spDefense) baseStats.spDefense = parseInt(spDefense)
    if (speed) baseStats.speed = parseInt(speed)

    const statsProvided = Object.keys(baseStats).length > 0

    try {
      const { data } = await updatePokemon({
        variables: {
          input: {
            id: pokemon.id,
            name,
            height: parseFloat(height),
            weight: parseFloat(weight),
            image: image || undefined,
            types: selectedTypes.length > 0 ? selectedTypes : undefined,
            abilities: filteredAbilities.length > 0 ? filteredAbilities : undefined,
            baseStats: statsProvided ? baseStats : undefined,
            description: description || undefined,
            species: species || undefined,
          },
        },
      })

      if (data?.updatePokemon) {
        router.push(`/pokemon/${encodeURIComponent(data.updatePokemon.name.toLowerCase())}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update Pokemon')
    }
  }

  return (
    <div className="min-h-screen">
      {/* Main Container - matches search page structure */}
      <div className="max-w-7xl mx-auto" style={{ backgroundColor: 'white' }}>
        <div className="px-6 py-8">
          {/* Back Link */}
          <Link 
            href={`/pokemon/${encodeURIComponent(pokemonName.toLowerCase())}`}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6"
            style={{ fontFamily: 'Flexo-Medium, arial, sans-serif' }}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Pokémon
          </Link>

          {/* Form Card */}
          <div 
            className="rounded-lg p-8 md:p-12 max-w-4xl mx-auto"
            style={{ 
              backgroundColor: '#3d3d3d',
            }}
          >
          <h2 
            className="text-3xl font-semibold text-white mb-8"
            style={{ fontFamily: 'Flexo-Demi, arial, sans-serif' }}
          >
            Edit Pokémon
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <h3 
                className="text-xl font-semibold text-white border-b pb-2"
                style={{ fontFamily: 'Flexo-Demi, arial, sans-serif', borderColor: '#5a5a5a' }}
              >
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label 
                    className="block text-sm font-semibold text-white mb-2"
                    style={{ fontFamily: 'Flexo-Demi, arial, sans-serif' }}
                  >
                    Name <span style={{ color: '#ee6b2f' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg"
                    style={{ 
                      backgroundColor: '#fff',
                      color: '#212121',
                      fontFamily: 'Flexo-Regular, arial, sans-serif'
                    }}
                    placeholder="Enter Pokémon name..."
                  />
                </div>

                <div>
                  <label 
                    className="block text-sm font-semibold text-white mb-2"
                    style={{ fontFamily: 'Flexo-Demi, arial, sans-serif' }}
                  >
                    Species
                  </label>
                  <input
                    type="text"
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg"
                    style={{ 
                      backgroundColor: '#fff',
                      color: '#212121',
                      fontFamily: 'Flexo-Regular, arial, sans-serif'
                    }}
                    placeholder="e.g., Seed Pokémon"
                  />
                </div>

                <div>
                  <label 
                    className="block text-sm font-semibold text-white mb-2"
                    style={{ fontFamily: 'Flexo-Demi, arial, sans-serif' }}
                  >
                    Height (meters) <span style={{ color: '#ee6b2f' }}>*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg"
                    style={{ 
                      backgroundColor: '#fff',
                      color: '#212121',
                      fontFamily: 'Flexo-Regular, arial, sans-serif'
                    }}
                    placeholder="0.0"
                  />
                </div>

                <div>
                  <label 
                    className="block text-sm font-semibold text-white mb-2"
                    style={{ fontFamily: 'Flexo-Demi, arial, sans-serif' }}
                  >
                    Weight (kilograms) <span style={{ color: '#ee6b2f' }}>*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg"
                    style={{ 
                      backgroundColor: '#fff',
                      color: '#212121',
                      fontFamily: 'Flexo-Regular, arial, sans-serif'
                    }}
                    placeholder="0.0"
                  />
                </div>
              </div>

              <div>
                <label 
                  className="block text-sm font-semibold text-white mb-2"
                  style={{ fontFamily: 'Flexo-Demi, arial, sans-serif' }}
                >
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg resize-none"
                  style={{ 
                    backgroundColor: '#fff',
                    color: '#212121',
                    fontFamily: 'Flexo-Regular, arial, sans-serif'
                  }}
                  placeholder="Enter Pokémon description..."
                />
              </div>
            </div>

            {/* Images Section */}
            <div className="space-y-6">
              <h3 
                className="text-xl font-semibold text-white border-b pb-2"
                style={{ fontFamily: 'Flexo-Demi, arial, sans-serif', borderColor: '#5a5a5a' }}
              >
                Image
              </h3>

              <div>
                <label 
                  className="block text-sm font-semibold text-white mb-2"
                  style={{ fontFamily: 'Flexo-Demi, arial, sans-serif' }}
                >
                  Image URL
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg"
                  style={{ 
                    backgroundColor: '#fff',
                    color: '#212121',
                    fontFamily: 'Flexo-Regular, arial, sans-serif'
                  }}
                  placeholder="https://example.com/image.png"
                />
              </div>
            </div>

            {/* Types Section */}
            <div className="space-y-6">
              <h3 
                className="text-xl font-semibold text-white border-b pb-2"
                style={{ fontFamily: 'Flexo-Demi, arial, sans-serif', borderColor: '#5a5a5a' }}
              >
                Types
              </h3>
              <div className="flex flex-wrap gap-3">
                {POKEMON_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleType(type)}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                      selectedTypes.includes(type)
                        ? 'ring-2 ring-orange-500'
                        : 'opacity-70'
                    }`}
                    style={{
                      backgroundColor: selectedTypes.includes(type) ? '#5a5a5a' : '#4a4a4a',
                      color: '#fff',
                      fontFamily: 'Flexo-Demi, arial, sans-serif'
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Abilities Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 
                  className="text-xl font-semibold text-white border-b pb-2 flex-1"
                  style={{ fontFamily: 'Flexo-Demi, arial, sans-serif', borderColor: '#5a5a5a' }}
                >
                  Abilities
                </h3>
                <button
                  type="button"
                  onClick={addAbility}
                  className="px-4 py-2 rounded-lg font-semibold text-sm text-white transition-colors"
                  style={{ 
                    backgroundColor: '#5a5a5a',
                    fontFamily: 'Flexo-Demi, arial, sans-serif'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#6a6a6a'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#5a5a5a'}
                >
                  + Add Ability
                </button>
              </div>
              <div className="space-y-3">
                {abilities.map((ability, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={ability}
                      onChange={(e) => updateAbility(index, e.target.value)}
                      className="flex-1 px-4 py-3 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg"
                      style={{ 
                        backgroundColor: '#fff',
                        color: '#212121',
                        fontFamily: 'Flexo-Regular, arial, sans-serif'
                      }}
                      placeholder="Enter ability name..."
                    />
                    {abilities.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAbility(index)}
                        className="px-4 py-3 rounded-lg font-semibold text-white transition-colors"
                        style={{ 
                          backgroundColor: '#ee6b2f',
                          fontFamily: 'Flexo-Demi, arial, sans-serif'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d25915'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ee6b2f'}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Base Stats Section */}
            <div className="space-y-6">
              <h3 
                className="text-xl font-semibold text-white border-b pb-2"
                style={{ fontFamily: 'Flexo-Demi, arial, sans-serif', borderColor: '#5a5a5a' }}
              >
                Base Stats
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <label 
                    className="block text-sm font-semibold text-white mb-2"
                    style={{ fontFamily: 'Flexo-Demi, arial, sans-serif' }}
                  >
                    HP
                  </label>
                  <input
                    type="number"
                    value={hp}
                    onChange={(e) => setHp(e.target.value)}
                    min="0"
                    max="255"
                    className="w-full px-4 py-3 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg"
                    style={{ 
                      backgroundColor: '#fff',
                      color: '#212121',
                      fontFamily: 'Flexo-Regular, arial, sans-serif'
                    }}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label 
                    className="block text-sm font-semibold text-white mb-2"
                    style={{ fontFamily: 'Flexo-Demi, arial, sans-serif' }}
                  >
                    Attack
                  </label>
                  <input
                    type="number"
                    value={attack}
                    onChange={(e) => setAttack(e.target.value)}
                    min="0"
                    max="255"
                    className="w-full px-4 py-3 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg"
                    style={{ 
                      backgroundColor: '#fff',
                      color: '#212121',
                      fontFamily: 'Flexo-Regular, arial, sans-serif'
                    }}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label 
                    className="block text-sm font-semibold text-white mb-2"
                    style={{ fontFamily: 'Flexo-Demi, arial, sans-serif' }}
                  >
                    Defense
                  </label>
                  <input
                    type="number"
                    value={defense}
                    onChange={(e) => setDefense(e.target.value)}
                    min="0"
                    max="255"
                    className="w-full px-4 py-3 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg"
                    style={{ 
                      backgroundColor: '#fff',
                      color: '#212121',
                      fontFamily: 'Flexo-Regular, arial, sans-serif'
                    }}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label 
                    className="block text-sm font-semibold text-white mb-2"
                    style={{ fontFamily: 'Flexo-Demi, arial, sans-serif' }}
                  >
                    Sp. Attack
                  </label>
                  <input
                    type="number"
                    value={spAttack}
                    onChange={(e) => setSpAttack(e.target.value)}
                    min="0"
                    max="255"
                    className="w-full px-4 py-3 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg"
                    style={{ 
                      backgroundColor: '#fff',
                      color: '#212121',
                      fontFamily: 'Flexo-Regular, arial, sans-serif'
                    }}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label 
                    className="block text-sm font-semibold text-white mb-2"
                    style={{ fontFamily: 'Flexo-Demi, arial, sans-serif' }}
                  >
                    Sp. Defense
                  </label>
                  <input
                    type="number"
                    value={spDefense}
                    onChange={(e) => setSpDefense(e.target.value)}
                    min="0"
                    max="255"
                    className="w-full px-4 py-3 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg"
                    style={{ 
                      backgroundColor: '#fff',
                      color: '#212121',
                      fontFamily: 'Flexo-Regular, arial, sans-serif'
                    }}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label 
                    className="block text-sm font-semibold text-white mb-2"
                    style={{ fontFamily: 'Flexo-Demi, arial, sans-serif' }}
                  >
                    Speed
                  </label>
                  <input
                    type="number"
                    value={speed}
                    onChange={(e) => setSpeed(e.target.value)}
                    min="0"
                    max="255"
                    className="w-full px-4 py-3 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg"
                    style={{ 
                      backgroundColor: '#fff',
                      color: '#212121',
                      fontFamily: 'Flexo-Regular, arial, sans-serif'
                    }}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div 
                className="rounded-lg p-4"
                style={{ 
                  backgroundColor: '#5a5a5a',
                  border: '2px solid #ee6b2f'
                }}
              >
                <p 
                  className="text-white font-semibold"
                  style={{ fontFamily: 'Flexo-Demi, arial, sans-serif' }}
                >
                  {error}
                </p>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: '#ee6b2f',
                  fontFamily: 'Flexo-Demi, arial, sans-serif'
                }}
                onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = '#d25915')}
                onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = '#ee6b2f')}
              >
                {loading ? 'Updating...' : 'Update Pokémon'}
              </button>
              <Link
                href={`/pokemon/${encodeURIComponent(pokemonName.toLowerCase())}`}
                className="flex-1 px-6 py-3 rounded-lg font-semibold text-center flex items-center justify-center transition-colors"
                style={{ 
                  backgroundColor: '#5a5a5a',
                  color: '#fff',
                  fontFamily: 'Flexo-Demi, arial, sans-serif'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#6a6a6a'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#5a5a5a'}
              >
                Cancel
              </Link>
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  )
}


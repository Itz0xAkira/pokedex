/**
 * Advanced filtering panel with comprehensive Pokemon search options.
 * Includes type/weakness toggles, ability dropdown, size classes, and number ranges.
 */

'use client'

import React from 'react';
import type { PokemonFilters } from '@/types/filters';
import TypeBadge from './TypeBadge';

const types = [
  'Bug', 'Dark', 'Dragon', 'Electric', 'Fairy', 'Fighting', 
  'Fire', 'Flying', 'Ghost', 'Grass', 'Ground', 'Ice', 
  'Normal', 'Poison', 'Psychic', 'Rock', 'Steel', 'Water'
];

const abilities = [
  'All', 'Blaze', 'Overgrow', 'Torrent', 'Static', 'Flash Fire', 
  'Solar Power', 'Adaptability', 'Aftermath', 'Chlorophyll', 
  'Intimidate', 'Lightning Rod', 'Levitate', 'Immunity', 'Thick Fat'
];

interface AdvancedSearchProps {
  filters: PokemonFilters;
  setFilters: (filters: PokemonFilters) => void;
  onSearch: () => void;
  onReset: () => void;
}

export default function AdvancedSearch({ filters, setFilters, onSearch, onReset }: AdvancedSearchProps) {
  // Toggle type or weakness filter on/off
  const toggleType = (type: string, isWeakness = false) => {
    const key = isWeakness ? 'weaknesses' : 'types';
    const current = filters[key] || [];

    if (current.includes(type)) {
      setFilters({ ...filters, [key]: current.filter((t: string) => t !== type) });
    } else {
      setFilters({ ...filters, [key]: [...current, type] });
    }
  };

  return (
    <div className="rounded-b-lg rounded-b-none p-8 pb-8" style={{ backgroundColor: '#7F7F7F' }}>
      <div className="grid grid-cols-2 gap-12">
        <div>
          <h3 className="text-white font-bold text-2xl mb-4">
            Type & Weakness 
            <span className="text-base font-normal ml-4">T = Type  W = Weakness</span>
          </h3>
          
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {types.map((type) => (
              <div key={type} className="flex items-center gap-2">
                <div className="flex-1">
                  <TypeBadge type={type} className="text-sm w-full" />
                </div>
                <button
                  onClick={() => toggleType(type, false)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                    filters.types?.includes(type) 
                      ? 'bg-white text-gray-900' 
                      : 'bg-gray-500 text-white'
                  }`}
                  aria-label={`Toggle ${type} type filter`}
                >
                  T
                </button>

                <button
                  onClick={() => toggleType(type, true)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                    filters.weaknesses?.includes(type) 
                      ? 'bg-white text-gray-900' 
                      : 'bg-gray-500 text-white'
                  }`}
                  aria-label={`Toggle ${type} weakness filter`}
                >
                  W
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-white font-bold text-2xl mb-3">Ability</h3>
            <select
              value={filters.ability || 'All'}
              onChange={(e) => setFilters({ ...filters, ability: e.target.value })}
              className="w-full bg-gray-700 text-white border-0 h-12 px-4 rounded"
              aria-label="Filter by Pokémon ability"
            >
              {abilities.map((ability) => (
                <option key={ability} value={ability}>{ability}</option>
              ))}
            </select>
          </div>
          

          <div>
            <h3 className="text-white font-bold text-2xl mb-3">Height</h3>
            <div className="grid grid-cols-3 gap-3">
              {([
                { key: 'small' as const, icon: '🐭', label: 'Small' },
                { key: 'medium' as const, icon: '🦎', label: 'Medium' },
                { key: 'large' as const, icon: '🦕', label: 'Large' }
              ] as const).map((size) => (
                <button
                  key={size.key}
                  onClick={() => setFilters({ 
                    ...filters, 
                    height_class: filters.height_class === size.key ? undefined : size.key 
                  })}
                  className={`h-24 rounded-lg flex items-center justify-center text-4xl transition-colors ${
                    filters.height_class === size.key 
                      ? 'bg-white' 
                      : 'bg-gray-300'
                  }`}
                  aria-label={`Filter by ${size.label} height`}
                >
                  {size.icon}
                </button>
              ))}
            </div>
          </div>
          
          {/* Weight Class Buttons */}
          <div>
            <h3 className="text-white font-bold text-2xl mb-3">Weight</h3>
            <div className="grid grid-cols-3 gap-3">
              {([
                { key: 'light' as const, dots: 1, label: 'Light' },
                { key: 'medium' as const, dots: 2, label: 'Medium' },
                { key: 'heavy' as const, dots: 3, label: 'Heavy' }
              ] as const).map((weight) => (
                <button
                  key={weight.key}
                  onClick={() => setFilters({ 
                    ...filters, 
                    weight_class: filters.weight_class === weight.key ? undefined : weight.key 
                  })}
                  className={`h-24 rounded-lg flex items-center justify-center transition-colors ${
                    filters.weight_class === weight.key 
                      ? 'bg-white' 
                      : 'bg-gray-300'
                  }`}
                  aria-label={`Filter by ${weight.label} weight`}
                >
                  {/* Visual weight indicators using dot patterns */}
                  <div className="flex flex-col gap-1 items-center justify-center">
                    {weight.dots === 1 && <div className="w-4 h-4 bg-gray-900 rounded-full" />}
                    {weight.dots === 2 && (
                      <>
                        <div className="flex gap-1">
                          <div className="w-3 h-3 bg-gray-900 rounded-full" />
                          <div className="w-3 h-3 bg-gray-900 rounded-full" />
                        </div>
                        <div className="w-3 h-3 bg-gray-900 rounded-full" />
                      </>
                    )}

                    {weight.dots === 3 && (
                      <>
                        <div className="w-3 h-3 bg-gray-900 rounded-full" />
                        <div className="flex gap-1">
                          <div className="w-3 h-3 bg-gray-900 rounded-full" />
                          <div className="w-3 h-3 bg-gray-900 rounded-full" />
                        </div>
                        <div className="flex gap-1">
                          <div className="w-3 h-3 bg-gray-900 rounded-full" />
                          <div className="w-3 h-3 bg-gray-900 rounded-full" />
                          <div className="w-3 h-3 bg-gray-900 rounded-full" />
                        </div>
                      </>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-white font-bold text-2xl mb-3">Number Range</h3>
        <div className="flex items-center gap-4">
          <input 
            type="number" 
            placeholder="1"
            value={filters.numberMin || ''}
            onChange={(e) => setFilters({ ...filters, numberMin: e.target.value })}
            className="bg-white w-32 h-12 text-center text-lg rounded px-2"
            aria-label="Minimum Pokédex number"
            min="1"
          />
          
          <span className="text-white text-xl">-</span>
          <input 
            type="number" 
            placeholder="1025"
            value={filters.numberMax || ''}
            onChange={(e) => setFilters({ ...filters, numberMax: e.target.value })}
            className="bg-white w-32 h-12 text-center text-lg rounded px-2"
            aria-label="Maximum Pokédex number"
            min="1"
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-4 pt-8 pb-0">
        <button 
          onClick={onReset}
          className="bg-gray-500 hover:bg-gray-600 text-white px-8 h-12 text-lg rounded-lg transition-colors"
          aria-label="Reset all filters"
        >
          Reset
        </button>

        <button 
          onClick={onSearch}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 h-12 text-lg rounded-lg transition-colors"
          aria-label="Search with current filters"
        >
          🔍 Search
        </button>
      </div>
    </div>
  );
}



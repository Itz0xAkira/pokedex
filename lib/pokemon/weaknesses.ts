/**
 * Pokemon Weakness Calculation Utility
 * 
 * Calculates Pokemon weaknesses based on their types
 */

/**
 * Type effectiveness table mapping Pokemon types to their weaknesses
 */
const typeWeaknesses: { [key: string]: string[] } = {
  'Normal': ['Fighting'],
  'Fire': ['Water', 'Ground', 'Rock'],
  'Water': ['Electric', 'Grass'],
  'Electric': ['Ground'],
  'Grass': ['Fire', 'Ice', 'Poison', 'Flying', 'Bug'],
  'Ice': ['Fire', 'Fighting', 'Rock', 'Steel'],
  'Fighting': ['Flying', 'Psychic', 'Fairy'],
  'Poison': ['Ground', 'Psychic'],
  'Ground': ['Water', 'Grass', 'Ice'],
  'Flying': ['Electric', 'Ice', 'Rock'],
  'Psychic': ['Bug', 'Ghost', 'Dark'],
  'Bug': ['Fire', 'Flying', 'Rock'],
  'Rock': ['Water', 'Grass', 'Fighting', 'Ground', 'Steel'],
  'Ghost': ['Ghost', 'Dark'],
  'Dragon': ['Ice', 'Dragon', 'Fairy'],
  'Dark': ['Fighting', 'Bug', 'Fairy'],
  'Steel': ['Fire', 'Fighting', 'Ground'],
  'Fairy': ['Poison', 'Steel'],
};

/**
 * Calculate weaknesses for a Pokemon based on its types
 * @param types Array of Pokemon types
 * @returns Array of weakness types
 */
export function calculateWeaknesses(types: string[]): string[] {
  const weaknessesSet = new Set<string>();
  
  types.forEach(type => {
    const typeW = typeWeaknesses[type] || [];
    typeW.forEach(w => weaknessesSet.add(w));
  });

  return Array.from(weaknessesSet);
}


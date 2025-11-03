export interface PokemonStats {
  hp?: number | null;
  attack?: number | null;
  defense?: number | null;
  spAttack?: number | null;
  spDefense?: number | null;
  speed?: number | null;
}

export interface Pokemon {
  id: string;
  name: string;
  pokedexId: number | null;
  height: number;
  weight: number;
  image: string | null;
  imageShiny: string | null;
  types: string[];
  abilities: string[];
  baseStats: PokemonStats | null;
  description: string | null;
  species: string | null;
  isCustom: boolean;
  createdByUserId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PokemonListItem {
  id: string;
  name: string;
  pokedexId: number | null;
  image: string | null;
  types: string[];
}

export interface TypeColors {
  [key: string]: string;
}

export type PokemonType = 
  | 'Normal'
  | 'Fire'
  | 'Water'
  | 'Electric'
  | 'Grass'
  | 'Ice'
  | 'Fighting'
  | 'Poison'
  | 'Ground'
  | 'Flying'
  | 'Psychic'
  | 'Bug'
  | 'Rock'
  | 'Ghost'
  | 'Dragon'
  | 'Dark'
  | 'Steel'
  | 'Fairy';


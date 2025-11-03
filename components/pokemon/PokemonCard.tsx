import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import type { PokemonCardProps } from '@/types';
import TypeBadge from './TypeBadge';

// Fix common image URL issues and provide fallback
function fixImageUrl(url: string | null): string {
  if (!url) return '/images/048_1.png';
  
  let fixedUrl = url.trim();
  
  // Fix common typo in URLs
  if (fixedUrl.startsWith('ttps://')) {
    fixedUrl = 'h' + fixedUrl;
  }
  
  // Add protocol if missing
  if (!fixedUrl.startsWith('http://') && !fixedUrl.startsWith('https://')) {
    if (fixedUrl.startsWith('www.') || fixedUrl.includes('.')) {
      fixedUrl = 'https://' + fixedUrl;
    } else {
      return fixedUrl;
    }
  }
  
  return fixedUrl;
}

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  const pokemonUrl = `/pokemon/${encodeURIComponent(pokemon.name.toLowerCase())}`;
  
  // Handle image loading with fallback
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(() => fixImageUrl(pokemon.image));

  const handleError = () => {
    if (!imageError) {
      setImageError(true);
      setImageSrc('/images/048_1.png');
    }
  };
  // Update image when Pokemon changes
  useEffect(() => {
    if (pokemon.image) {
      const fixed = fixImageUrl(pokemon.image);
      setImageSrc(fixed);
      setImageError(false);
    } else {
      setImageSrc('/images/048_1.png');
      setImageError(false);
    }
  }, [pokemon.image]);
  
  return (
    <Link href={pokemonUrl}>
      <div className="bg-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="bg-white p-6 flex items-center justify-center" style={{ minHeight: '200px' }}>
          <img 
            src={imageSrc}
            alt={pokemon.name}
            className="w-full h-full object-contain"
            loading="lazy"
            onError={handleError}
          />
        </div>
        <div className="p-4">
          <p className="text-gray-500 text-sm mb-1">
            #{String(pokemon.pokedexId || '').padStart(4, '0')}
          </p>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            {pokemon.name}
          </h3>
          <div className="flex gap-2">
            {pokemon.types?.map((type) => (
              <TypeBadge key={type} type={type} className="text-sm" />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}




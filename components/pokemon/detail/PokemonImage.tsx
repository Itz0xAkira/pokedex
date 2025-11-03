/**
 * Pokemon Image Component
 * 
 * Displays the Pokemon image with lazy loading and error handling
 */

import React, { useState } from 'react';

interface PokemonImageProps {
  image: string | null;
  name: string;
}

/**
 * Fixes common URL issues:
 * - Adds https:// if missing
 * - Fixes ttps:// -> https://
 * - Ensures proper protocol
 */
function fixImageUrl(url: string | null): string {
  if (!url) return '/images/048_1.png';
  
  let fixedUrl = url.trim();
  
  // Fix common typo: ttps:// -> https://
  if (fixedUrl.startsWith('ttps://')) {
    fixedUrl = 'h' + fixedUrl;
  }
  
  // Add https:// if no protocol is present
  if (!fixedUrl.startsWith('http://') && !fixedUrl.startsWith('https://')) {
    // Check if it looks like a URL (starts with www. or a domain)
    if (fixedUrl.startsWith('www.') || fixedUrl.includes('.')) {
      fixedUrl = 'https://' + fixedUrl;
    } else {
      // If it doesn't look like a URL, return as-is (might be a relative path)
      return fixedUrl;
    }
  }
  
  return fixedUrl;
}

export default function PokemonImage({ image, name }: PokemonImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(() => fixImageUrl(image));

  const handleError = () => {
    if (!imageError) {
      setImageError(true);
      setImageSrc('/images/048_1.png');
    }
  };

  // Update image src when image prop changes
  React.useEffect(() => {
    if (image) {
      const fixed = fixImageUrl(image);
      setImageSrc(fixed);
      setImageError(false);
    } else {
      setImageSrc('/images/048_1.png');
      setImageError(false);
    }
  }, [image]);

  return (
    <div 
      className="rounded-lg p-8 flex items-center justify-center"
      style={{ backgroundColor: '#f5f5f5' }}
    >
      <img 
        src={imageSrc}
        alt={name}
        className="w-full max-w-sm object-contain"
        loading="lazy"
        onError={handleError}
      />
    </div>
  );
}


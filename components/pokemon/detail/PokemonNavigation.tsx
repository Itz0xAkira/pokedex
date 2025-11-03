/**
 * Pokemon Navigation Component
 * 
 * Displays Previous and Next Pokemon navigation buttons with gap between them
 */

'use client'

import React, { useState, useRef } from 'react';

interface PokemonListItem {
  id?: string;
  name: string;
  pokedexId: number | null;
}

interface PokemonNavigationProps {
  previousPokemon: PokemonListItem | null;
  nextPokemon: PokemonListItem | null;
  onNavigate: (pokemon: { name: string }) => void;
}

const ChevronLeft = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export default function PokemonNavigation({ 
  previousPokemon, 
  nextPokemon, 
  onNavigate 
}: PokemonNavigationProps) {
  const [hoveredButton, setHoveredButton] = useState<'previous' | 'next' | null>(null);
  const previousDivRef = useRef<HTMLDivElement>(null);
  const previousCutRef = useRef<HTMLDivElement>(null);
  const nextDivRef = useRef<HTMLDivElement>(null);
  const nextCutRef = useRef<HTMLDivElement>(null);

  const handlePreviousHover = (isHovering: boolean) => {
    if (isHovering) {
      setHoveredButton('previous');
      previousDivRef.current?.style.setProperty('background-color', '#6a6a6a');
      previousCutRef.current?.style.setProperty('border-left', '60px solid #6a6a6a');
    } else {
      setHoveredButton(null);
      previousDivRef.current?.style.setProperty('background-color', '#5a5a5a');
      previousCutRef.current?.style.setProperty('border-left', '60px solid #5a5a5a');
    }
  };

  const handleNextHover = (isHovering: boolean) => {
    if (isHovering) {
      setHoveredButton('next');
      nextDivRef.current?.style.setProperty('background-color', '#6a6a6a');
      nextCutRef.current?.style.setProperty('border-right', '60px solid #6a6a6a');
    } else {
      setHoveredButton(null);
      nextDivRef.current?.style.setProperty('background-color', '#5a5a5a');
      nextCutRef.current?.style.setProperty('border-right', '60px solid #5a5a5a');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex gap-4" style={{  }}>
        {previousPokemon ? (
          <button
            onClick={() => onNavigate(previousPokemon)}
            className="flex-1 flex items-center gap-3 px-8 py-5 transition-colors"
            style={{ 
              backgroundColor: '#5a5a5a',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#6a6a6a';
              handlePreviousHover(true);
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#5a5a5a';
              handlePreviousHover(false);
            }}
          >
            <ChevronLeft className="w-8 h-8 text-white" />
            <span 
              className="text-2xl font-bold text-white"
              style={{ fontFamily: 'Flexo-Demi, arial, sans-serif' }}
            >
              #{String(previousPokemon.pokedexId || '').padStart(4, '0')}
            </span>
            <span 
              className="text-2xl text-white"
              style={{ fontFamily: 'Flexo-Regular, arial, sans-serif' }}
            >
              {previousPokemon.name}
            </span>
          </button>
        ) : (
          <div className="flex-1" style={{ backgroundColor: '#5a5a5a' }} />
        )}
        
        {nextPokemon ? (
          <button
            onClick={() => onNavigate(nextPokemon)}
            className="flex-1 flex items-center justify-end gap-3 px-8 py-5 transition-colors"
            style={{ 
              backgroundColor: '#5a5a5a',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#6a6a6a';
              handleNextHover(true);
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#5a5a5a';
              handleNextHover(false);
            }}
          >
            <span 
              className="text-2xl text-white"
              style={{ fontFamily: 'Flexo-Regular, arial, sans-serif' }}
            >
              {nextPokemon.name}
            </span>
            <span 
              className="text-2xl font-bold text-white"
              style={{ fontFamily: 'Flexo-Demi, arial, sans-serif' }}
            >
              #{String(nextPokemon.pokedexId || '').padStart(4, '0')}
            </span>
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
        ) : (
          <div className="flex-1" style={{ backgroundColor: '#5a5a5a' }} />
        )}
      </div>
      <div className="flex justify-between gap-4 relative z-20" style={{ height: '60px' }}>
        <div 
          ref={previousDivRef}
          style={{ 
            backgroundColor: '#5a5a5a',
            position: 'relative',
            height: '60px',
            width: '10%',
            transition: 'background-color 0.2s',
            zIndex: 20
          }}
          onMouseOver={() => handlePreviousHover(true)}
          onMouseOut={() => handlePreviousHover(false)}
        >
          <div
            ref={previousCutRef}
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              borderBottom: '60px solid ',
              borderLeft: '60px solid #5a5a5a',
              width: 0,
              height: 0,
              transition: 'border-left 0.2s'
            }}
          />
        </div>
        <div 
          ref={nextDivRef}
          style={{ 
            backgroundColor: '#5a5a5a',
            position: 'relative',
            height: '60px',
            width: '10%',
            transition: 'background-color 0.2s',
            zIndex: 20
          }}
          onMouseOver={() => handleNextHover(true)}
          onMouseOut={() => handleNextHover(false)}
        >
          <div
            ref={nextCutRef}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              borderBottom: '60px solid ',
              borderRight: '60px solid #5a5a5a',
              width: 0,
              height: 0,
              transition: 'border-right 0.2s'
            }}
          />
        </div>
      </div>
    </div>
  );
}


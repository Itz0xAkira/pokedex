/**
 * AdvancedSearchToggle Component
 * 
 * A toggle button that shows/hides the advanced search panel.
 * Features:
 * - Gray background with hover effects
 * - Chevron icon that rotates when toggled
 * - Decorative notch at the bottom center (Tailwind classes)
 * - Flexo-Demi font family for consistent typography
 * 
 * Props:
 * - showAdvanced: Whether the advanced search panel is currently visible
 * - onToggle: Callback function when the button is clicked
 */

'use client'

import React, { useRef } from 'react';
import type { AdvancedSearchToggleProps } from '@/types';
import { ChevronDown } from '../shared/Icons';

export default function AdvancedSearchToggle({
  showAdvanced,
  onToggle,
}: AdvancedSearchToggleProps) {
  const leftCutRef = useRef<HTMLDivElement>(null);
  const rightCutRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex justify-center mb-4">
    <button
      onClick={onToggle}
      className="inline-flex bg-[#7F7F7F]   py-4 px-8 items-center justify-center gap-3 text-white text-lg font-semibold transition-colors relative overflow-hidden"
      style={{ fontFamily: 'Flexo-Demi, arial, sans-serif', boxShadow: 'none', minWidth: '350px' , height: '40px'}}
      aria-label={showAdvanced ? 'Hide Advanced Search' : 'Show Advanced Search'}
      aria-expanded={showAdvanced}
      onMouseOver={() => {
        leftCutRef.current?.style.setProperty('border-right', '40px solid #7F7F7F');
        rightCutRef.current?.style.setProperty('border-left', '40px solid #7F7F7F');
      }}
      onMouseOut={() => {
        leftCutRef.current?.style.setProperty('border-right', '40px solid #7F7F7F');
        rightCutRef.current?.style.setProperty('border-left', '40px solid #7F7F7F');
      }}
    >
      {/* Toggle Text */}
      <span className="relative z-10">{showAdvanced ? 'Hide' : 'Show'} Advanced Search</span>
      
      {/* Chevron Icon - Rotates when expanded */}
      <ChevronDown 
        className={`transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''} relative z-10`}
        style={{ width: '24px', height: '24px' }}
      />
      
      {/* Diagonal Cut - Bottom Left */}
      <div
        ref={leftCutRef}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          borderBottom: '60px solid rgb(255, 255, 255)',
          borderRight: '40px solid #7F7F7F',
          width: 0,
          height: 0,
          transition: 'border-right 0.2s'
        }}
      />
      
      {/* Diagonal Cut - Bottom Right */}
      <div
        ref={rightCutRef}
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          borderBottom: '60px solid rgb(255, 255, 255)',
          borderLeft: '40px solid #7F7F7F',
          width: 0,
          height: 0,
          transition: 'border-left 0.2s'
        }}
      />
    </button>
    </div>
  );
}



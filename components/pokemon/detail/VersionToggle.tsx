/**
 * Version Toggle Component
 * 
 * Allows users to switch between Pokemon X and Y versions
 */

'use client'

import React from 'react';

interface VersionToggleProps {
  selectedVersion: 'x' | 'y';
  onVersionChange: (version: 'x' | 'y') => void;
}

export default function VersionToggle({ selectedVersion, onVersionChange }: VersionToggleProps) {
  return (
    <div className="flex items-center gap-3">
      <span 
        className="font-semibold text-gray-900"
        style={{ fontFamily: 'Flexo-Demi, arial, sans-serif' }}
      >
        Versions:
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => onVersionChange('x')}
          className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-colors ${
            selectedVersion === 'x' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 bg-white'
          }`}
          aria-label="Pokemon X version"
        >
          <span className="text-blue-600 text-2xl">⚪</span>
        </button>
        <button
          onClick={() => onVersionChange('y')}
          className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-colors ${
            selectedVersion === 'y' 
              ? 'border-pink-500 bg-pink-50' 
              : 'border-gray-300 bg-white'
          }`}
          aria-label="Pokemon Y version"
        >
          <span className="text-pink-600 text-2xl">⚪</span>
        </button>
      </div>
    </div>
  );
}


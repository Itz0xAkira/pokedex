/**
 * PaginationControls Component
 * 
 * Displays pagination controls for navigating through Pokemon results.
 */

'use client'

import React from 'react'
import { ChevronLeft, ChevronRight } from '../shared/Icons'

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
          currentPage === 1
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gray-600 text-white hover:bg-gray-700'
        }`}
        style={{ fontFamily: 'Flexo-Demi, arial, sans-serif' }}
      >
        <ChevronLeft className="w-5 h-5" />
        Previous
      </button>

      <span 
        className="text-gray-700 font-semibold"
        style={{ fontFamily: 'Flexo-Medium, arial, sans-serif' }}
      >
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
          currentPage === totalPages
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gray-600 text-white hover:bg-gray-700'
        }`}
        style={{ fontFamily: 'Flexo-Demi, arial, sans-serif' }}
      >
        Next
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}


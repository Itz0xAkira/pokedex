/**
 * Pagination controls with page size selector and smart page navigation.
 * Shows current range and provides Previous/Next navigation.
 */

'use client'

import React from 'react';
import type { PaginationControlsProps } from '@/types';
import { ChevronLeft, ChevronRight } from '../shared/Icons';

export default function PaginationControls({
  currentPage,
  totalPages,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
}: PaginationControlsProps) {
  // Calculate current page range for display
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-6 border-t border-gray-200">
      <div className="flex items-center gap-3">
        <span 
          className="text-gray-600 font-medium"
          style={{ fontFamily: 'Flexo-Medium, arial, sans-serif' }}
        >
          Show:
        </span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value) as 10 | 20 | 50)}
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
          style={{ fontFamily: 'Flexo-Regular, arial, sans-serif' }}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <span 
          className="text-gray-600 text-sm"
          style={{ fontFamily: 'Flexo-Regular, arial, sans-serif' }}
        >
          per page
        </span>
      </div>

      <div className="text-gray-600 text-sm" style={{ fontFamily: 'Flexo-Regular, arial, sans-serif' }}>
        Showing {startItem}-{endItem} of {totalCount} Pokémon
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center gap-2"
          style={{ fontFamily: 'Flexo-Medium, arial, sans-serif' }}
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Previous</span>
        </button>

        {/* Smart page number display (max 5 pages) */}
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum: number;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-10 h-10 rounded-lg border transition-colors ${
                  currentPage === pageNum
                    ? 'bg-orange-500 border-orange-500 text-white'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                style={{ fontFamily: 'Flexo-Medium, arial, sans-serif' }}
              >
                {pageNum}
              </button>
            );
          })}
        </div>


        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center gap-2"
          style={{ fontFamily: 'Flexo-Medium, arial, sans-serif' }}
        >
          <span>Next</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}



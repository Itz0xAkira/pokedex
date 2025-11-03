/**
 * Loading Overlay Component
 * 
 * Shows a loading spinner overlay during page transitions
 */

import React from 'react';

interface LoadingOverlayProps {
  isPending: boolean;
}

export default function LoadingOverlay({ isPending }: LoadingOverlayProps) {
  if (!isPending) return null;

  return (
    <div className="absolute inset-0 bg-black/20 z-50 flex items-center justify-center pointer-events-none">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
    </div>
  );
}


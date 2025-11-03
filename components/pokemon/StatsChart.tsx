import React, { useMemo } from 'react';

interface PokemonStats {
  hp?: number | null;
  attack?: number | null;
  defense?: number | null;
  spAttack?: number | null;
  spDefense?: number | null;
  speed?: number | null;
}

interface StatsChartProps {
  stats: PokemonStats | null | undefined;
}

function StatsChart({ stats }: StatsChartProps) {
  const statNames: { [key: string]: string } = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    spAttack: 'Special Attack',
    spDefense: 'Special Defense',
    speed: 'Speed'
  };

  const maxStat = 255;

  // Memoize stat entries to avoid recalculating on every render
  const statEntries = useMemo(() => {
    if (!stats) return null;
    
    return [
      { key: 'hp', value: stats.hp || 0 },
      { key: 'attack', value: stats.attack || 0 },
      { key: 'defense', value: stats.defense || 0 },
      { key: 'spAttack', value: stats.spAttack || 0 },
      { key: 'spDefense', value: stats.spDefense || 0 },
      { key: 'speed', value: stats.speed || 0 },
    ];
  }, [stats]);

  if (!statEntries) {
    return null;
  }

  return (
    <div className="bg-gray-500 rounded-lg p-6">
      <h3 className="text-white font-bold text-xl mb-6">Stats</h3>
      <div className="grid grid-cols-6 gap-4">
        {statEntries.map(({ key, value }) => {
          const percentage = (value / maxStat) * 100;
          const filledBars = Math.round((value / maxStat) * 20);
          
          return (
            <div key={key} className="flex flex-col items-center">
              {/* Bars */}
              <div className="w-full h-48 flex flex-col-reverse gap-0.5">
                {Array(20).fill(0).map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`w-full h-2 ${idx < filledBars ? 'bg-cyan-400' : 'bg-gray-400'}`}
                  />
                ))}
              </div>
              {/* Label */}
              <p className="text-white text-xs font-medium text-center mt-3">
                {statNames[key]}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Memoize component to prevent unnecessary re-renders
export default React.memo(StatsChart);



import React, { useState, useEffect } from 'react';
import { useSearchStore } from '@/src/stores/search.store';

export default function PriceRangeFilter({ config }) {
  const { filters, setFilter, removeFilter } = useSearchStore();
  
  const minVal = filters.minPrice || '';
  const maxVal = filters.maxPrice || '';
  
  const [localMin, setLocalMin] = useState(minVal);
  const [localMax, setLocalMax] = useState(maxVal);

  useEffect(() => {
    setLocalMin(filters.minPrice || '');
    setLocalMax(filters.maxPrice || '');
  }, [filters.minPrice, filters.maxPrice]);

  const handleApply = () => {
    if (!localMin && !localMax) {
      removeFilter('minPrice');
      removeFilter('maxPrice');
    } else {
      if (localMin) setFilter('minPrice', Number(localMin));
      else removeFilter('minPrice');
      
      if (localMax) setFilter('maxPrice', Number(localMax));
      else removeFilter('maxPrice');
    }
  };

  const handlePreset = (preset) => {
    setLocalMin(preset.min);
    setLocalMax(preset.max);
    if (preset.min) setFilter('minPrice', preset.min);
    else removeFilter('minPrice');
    
    if (preset.max) setFilter('maxPrice', preset.max);
    else removeFilter('maxPrice');
  };

  return (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <h3 className="text-sm font-bold text-gray-900 mb-3">{config.label}</h3>
      
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1">
          <input
            type="number"
            placeholder="Min"
            value={localMin}
            onChange={(e) => setLocalMin(e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:border-[#002B5B] focus:ring-0 outline-none"
          />
        </div>
        <span className="text-gray-400">-</span>
        <div className="flex-1">
          <input
            type="number"
            placeholder="Max"
            value={localMax}
            onChange={(e) => setLocalMax(e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:border-[#002B5B] focus:ring-0 outline-none"
          />
        </div>
        <button 
          onClick={handleApply}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-1.5 rounded text-sm transition-colors"
        >
          Go
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {config.presets.map((preset, index) => {
          const isActive = Number(localMin) === preset.min && Number(localMax) === preset.max;
          return (
            <button
              key={index}
              onClick={() => handlePreset(preset)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                isActive 
                  ? 'bg-blue-50 border-[#002B5B] text-[#002B5B]' 
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

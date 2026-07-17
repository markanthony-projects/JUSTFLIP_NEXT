import React from 'react';
import { useSearchStore } from '@/src/stores/search.store';
import { SEARCH_CONFIG } from '@/src/services/search/searchConfig';

export default function FilterChips() {
  const { filters, removeFilter, clearFilters } = useSearchStore();

  const activeChips = [];

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;

    if (key === 'minPrice' || key === 'maxPrice') return; // Handled specially

    const config = SEARCH_CONFIG.filters[key];
    if (config) {
      if (config.type === 'multi-select') {
        const values = value.split(',');
        values.forEach(v => {
          const option = config.options.find(o => o.value === v);
          if (option) {
            activeChips.push({
              id: `${key}-${v}`,
              label: option.label,
              onRemove: () => {
                const newValues = values.filter(val => val !== v);
                if (newValues.length === 0) {
                  removeFilter(key);
                } else {
                  useSearchStore.getState().setFilter(key, newValues.join(','));
                }
              }
            });
          }
        });
      } else if (config.type === 'single-select') {
        const option = config.options.find(o => o.value === value);
        if (option) {
          activeChips.push({
            id: key,
            label: option.label,
            onRemove: () => removeFilter(key)
          });
        }
      }
    }
  });

  // Handle Price Range Chip
  if (filters.minPrice || filters.maxPrice) {
    let label = 'Budget: ';
    
    const formatPrice = (val) => {
      if (val >= 10000000) return `₹${val/10000000}Cr`;
      if (val >= 100000) return `₹${val/100000}L`;
      return `₹${val}`;
    };

    if (filters.minPrice && filters.maxPrice) {
      label += `${formatPrice(filters.minPrice)} - ${formatPrice(filters.maxPrice)}`;
    } else if (filters.minPrice) {
      label += `Min ${formatPrice(filters.minPrice)}`;
    } else if (filters.maxPrice) {
      label += `Max ${formatPrice(filters.maxPrice)}`;
    }

    activeChips.push({
      id: 'priceRange',
      label,
      onRemove: () => {
        removeFilter('minPrice');
        removeFilter('maxPrice');
      }
    });
  }

  if (activeChips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mt-3">
      {activeChips.map(chip => (
        <span 
          key={chip.id}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100 text-[#002B5B] text-xs font-medium rounded-full"
        >
          {chip.label}
          <button
            onClick={chip.onRemove}
            className="w-4 h-4 inline-flex items-center justify-center rounded-full hover:bg-[#002B5B] hover:text-white transition-colors"
          >
            ✕
          </button>
        </span>
      ))}
      
      <button 
        onClick={clearFilters}
        className="text-xs text-gray-500 hover:text-gray-900 font-medium ml-2 underline underline-offset-2"
      >
        Clear All
      </button>
    </div>
  );
}

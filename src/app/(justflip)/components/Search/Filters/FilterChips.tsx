'use client';

import React from 'react';
import { useSearchStore } from '@/src/stores/search.store';
import { SEARCH_CONFIG } from '@/src/services/search/searchConfig';
import { FiX } from 'react-icons/fi';

export default function FilterChips() {
  const { filters, removeFilter, clearFilters } = useSearchStore();

  const activeChips: { id: string; label: string; onRemove: () => void }[] = [];

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;

    if (key === 'minPrice' || key === 'maxPrice') return; // Handled specially

    const config = SEARCH_CONFIG.filters[key];
    if (config) {
      if (config.type === 'multi-select' && typeof value === 'string') {
        const values = value.split(',');
        values.forEach((v: string) => {
          const option = config.options?.find((o: any) => o.value === v);
          activeChips.push({
            id: `${key}-${v}`,
            label: option ? option.label : v,
            onRemove: () => {
              const newValues = values.filter((val: string) => val !== v);
              if (newValues.length === 0) {
                removeFilter(key);
              } else {
                useSearchStore.getState().setFilter(key, newValues.join(','));
              }
            }
          });
        });
      } else if (config.type === 'single-select') {
        const option = config.options?.find((o: any) => o.value === value);
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

    const formatPrice = (val: number) => {
      if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
      if (val >= 100000) return `₹${(val / 100000).toFixed(0)}L`;
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
    <div className="p-3 bg-slate-50/90 border-b border-slate-100">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Active Filters ({activeChips.length})
        </span>
        <button
          onClick={clearFilters}
          className="text-xs text-rose-600 hover:text-rose-800 font-semibold hover:underline cursor-pointer transition-colors"
        >
          Reset All
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {activeChips.map((chip) => (
          <span
            key={chip.id}
            className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-0.5 bg-white border border-slate-200 text-slate-800 text-[11px] font-medium rounded-md shadow-2xs"
          >
            <span className="truncate max-w-[180px]">{chip.label}</span>
            <button
              onClick={chip.onRemove}
              aria-label={`Remove filter ${chip.label}`}
              className="w-3.5 h-3.5 inline-flex items-center justify-center rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <FiX className="w-2.5 h-2.5" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

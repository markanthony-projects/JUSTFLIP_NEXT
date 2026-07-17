import React from 'react';
import { useSearchStore } from '@/src/stores/search.store';

export default function SingleSelectFilter({ config }) {
  const { filters, setFilter, removeFilter } = useSearchStore();
  const currentValue = filters[config.key] || '';

  const handleChange = (optionValue) => {
    if (currentValue === optionValue) {
      removeFilter(config.key);
    } else {
      setFilter(config.key, optionValue);
    }
  };

  return (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <h3 className="text-sm font-bold text-gray-900 mb-3">{config.label}</h3>
      <div className="space-y-2">
        {config.options.map((option) => {
          const isSelected = currentValue === option.value;
          return (
            <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                isSelected ? 'border-[#002B5B]' : 'border-gray-300 group-hover:border-[#002B5B]'
              }`}>
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-[#002B5B]" />
                )}
              </div>
              <span className={`text-sm ${isSelected ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

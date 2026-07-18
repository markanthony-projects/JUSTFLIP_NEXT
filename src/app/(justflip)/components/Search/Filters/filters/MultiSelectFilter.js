import React from 'react';
import { useSearchStore } from '@/src/stores/search.store';

export default function MultiSelectFilter({ config }) {
  const { filters, setFilter, removeFilter } = useSearchStore();
  const currentValue = filters[config.key] || '';
  
  const selectedValues = currentValue ? currentValue.split(',') : [];

  const handleToggle = (optionValue) => {
    let newValues;
    if (selectedValues.includes(optionValue)) {
      newValues = selectedValues.filter(v => v !== optionValue);
    } else {
      newValues = [...selectedValues, optionValue];
    }

    if (newValues.length === 0) {
      removeFilter(config.key);
    } else {
      setFilter(config.key, newValues.join(','));
    }
  };

  return (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <h3 className="text-sm font-bold text-gray-900 mb-3">{config.label}</h3>
      <div className="space-y-2">
        {config.options.map((option) => {
          const isSelected = selectedValues.includes(option.value);
          return (
            <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                className="hidden" 
                checked={isSelected} 
                onChange={() => handleToggle(option.value)} 
              />
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                isSelected ? 'bg-[#002B5B] border-[#002B5B]' : 'border-gray-300 group-hover:border-[#002B5B]'
              }`}>
                {isSelected && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
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

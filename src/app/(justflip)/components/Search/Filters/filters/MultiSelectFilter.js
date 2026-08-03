import React from 'react';
import { useSearchStore } from '@/src/stores/search.store';

export default function MultiSelectFilter({ config, onClose }) {
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
    <div className="flex flex-col py-2 border-b border-gray-100 last:border-0">
      <h3 className="text-sm font-bold text-gray-900 mb-2">{config.label}</h3>
      <div className="flex flex-wrap gap-2">
        {config.options.map((option) => {
          const isSelected = selectedValues.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleToggle(option.value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                isSelected 
                  ? 'bg-blue-50 border-[#002B5B] text-[#002B5B]' 
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg leading-none">{isSelected ? '✓' : '+'}</span> {option.label}
            </button>
          );
        })}
      </div>
      
      {/* Done Button */}
      {onClose && (
        <div className="flex justify-end mt-2">
          <button 
            type="button"
            onClick={onClose}
            className="text-[#d32f2f] text-sm font-semibold hover:text-red-700 transition-colors"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}

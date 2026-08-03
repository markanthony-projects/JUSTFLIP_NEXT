import React from 'react';
import { useSearchStore } from '@/src/stores/search.store';
import { MdApartment, MdVilla, MdHome, MdMap } from 'react-icons/md';

const iconMap = {
    'apartment': <MdApartment className="w-6 h-6" />,
    'villa': <MdVilla className="w-6 h-6" />,
    'plot': <MdMap className="w-6 h-6" />,
    'residentialhouse': <MdHome className="w-6 h-6" />,
};

export default function PropertyTypeFilter({ config }) {
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
        <div className="py-2 border-b border-gray-100 last:border-0">
            <h3 className="text-sm font-bold text-gray-900 mb-2">{config.label}</h3>
            <div className="grid grid-cols-4 gap-2">
                {config.options.map((option) => {
                    const isSelected = selectedValues.includes(option.value);
                    const icon = iconMap[option.value];
                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => handleToggle(option.value)}
                            className={`flex flex-col items-center justify-center gap-1 p-2 px-3 rounded-xl border transition-all ${
                                isSelected 
                                ? 'bg-blue-50 border-[#002B5B] text-[#002B5B] shadow-sm' 
                                : 'bg-white border-gray-200 text-gray-500 hover:border-[#002B5B] hover:bg-gray-50'
                            }`}
                        >
                            <div className={isSelected ? 'text-[#002B5B]' : 'text-gray-400'}>
                                {icon}
                            </div>
                            <span className={`text-xs text-center ${isSelected ? 'font-semibold' : 'font-medium'}`}>
                                {option.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

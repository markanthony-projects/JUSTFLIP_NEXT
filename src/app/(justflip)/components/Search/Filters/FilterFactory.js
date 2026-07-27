import React from 'react';
import PriceRangeFilter from './filters/PriceRangeFilter';
import MultiSelectFilter from './filters/MultiSelectFilter';
import SingleSelectFilter from './filters/SingleSelectFilter';
import PropertyTypeFilter from './filters/PropertyTypeFilter';

export const FilterRegistry = {
  'range': PriceRangeFilter,
  'multi-select': MultiSelectFilter,
  'single-select': SingleSelectFilter,
  'property-type': PropertyTypeFilter,
};

export default function FilterFactory({ config }) {
  const FilterComponent = FilterRegistry[config.type];

  if (config.type === 'hidden') {
    return null;
  }

  if (!FilterComponent) {
    console.warn(`No filter component found for type: ${config.type}`);
    return null;
  }

  return <FilterComponent config={config} />;
}

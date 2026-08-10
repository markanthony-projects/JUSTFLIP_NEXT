export interface FilterOption {
  label: string;
  value: string;
}

export interface PresetOption {
  label: string;
  min: number;
  max: number;
}

export interface FilterConfig {
  key: string;
  apiParam?: string;
  apiParamMin?: string;
  apiParamMax?: string;
  label?: string;
  type: string;
  options?: FilterOption[];
  presets?: PresetOption[];
  icon?: string;
  min?: number;
  max?: number;
}

export interface SortOption {
  label: string;
  value: string;
}

export interface SearchConfig {
  adapter: string;
  defaultLimit: number;
  maxLimit: number;
  debounceMs: number;
  autocompleteDebounceMs: number;
  cacheStrategy: string;
  filters: Record<string, FilterConfig>;
  sortOptions: SortOption[];
}

export const SEARCH_CONFIG: SearchConfig = {
  adapter: 'portal',           // 'portal' | 'elasticsearch' | 'ai'
  defaultLimit: 20,
  maxLimit: 100,
  debounceMs: 350,
  autocompleteDebounceMs: 250,
  cacheStrategy: 'url-params', // Future: 'redis' | 'swr'
  
  // Filter definitions — add new filters here, UI auto-generates
  filters: {
    tag: {
      key: 'tag',
      apiParam: 'tag',
      type: 'hidden',
    },
    propertyType: {
      key: 'propertyType',
      apiParam: 'propertyType',
      label: 'Property Type',
      type: 'property-type',
      options: [
        { label: 'Apartment / Flats', value: 'apartment' },
        { label: 'Villa', value: 'villa' },
        { label: 'Plot / Land', value: 'plot' },
        { label: 'Residential House', value: 'residentialhouse' },
      ],
      icon: 'HiOutlineBuildingOffice2',
    },
    priceRange: {
      key: 'priceRange',
      apiParamMin: 'minPrice',
      apiParamMax: 'maxPrice',
      label: 'Budget',
      type: 'range',
      min: 0,
      max: 500000000,
      presets: [
        { label: 'Under ₹50L', min: 0, max: 5000000 },
        { label: '₹50L - ₹1Cr', min: 5000000, max: 10000000 },
        { label: '₹1Cr - ₹2Cr', min: 10000000, max: 20000000 },
        { label: '₹2Cr - ₹5Cr', min: 20000000, max: 50000000 },
        { label: '₹5Cr+', min: 50000000, max: 500000000 },
      ],
    },
    uploader: {
      key: 'uploader',
      apiParam: 'uploader',
      label: 'Posted By',
      type: 'multi-select',
      options: [
        { label: 'Owners', value: 'owner' },
        { label: 'Brokers', value: 'broker' },
        { label: 'Builders', value: 'builder' },
      ],
    },
    furnishing: {
      key: 'furnishing',
      apiParam: 'furnishing',
      label: 'Furnishing',
      type: 'multi-select',
      options: [
        { label: 'Furnished', value: 'furnished' },
        { label: 'Semi Furnished', value: 'semi-furnished' },
        { label: 'Unfurnished', value: 'unfurnished' },
      ],
    },
    unitType: {
      key: 'unitType',
      apiParam: 'unitType',
      label: 'BHK',
      type: 'multi-select',
      options: [
        { label: '1 BHK', value: '1BHK' },
        { label: '2 BHK', value: '2BHK' },
        { label: '3 BHK', value: '3BHK' },
        { label: '4 BHK', value: '4BHK' },
        { label: '5+ BHK', value: '5BHK+' },
      ],
    },
  },

  // Sort options
  sortOptions: [
    { label: 'Relevance', value: 'relevance' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Newest First', value: 'newest' },
    { label: 'Most Popular', value: 'popular' },
  ],
};

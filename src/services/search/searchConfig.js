export const SEARCH_CONFIG = {
  adapter: 'portal',           // 'portal' | 'elasticsearch' | 'ai'
  defaultLimit: 20,
  maxLimit: 100,
  debounceMs: 350,
  autocompleteDebounceMs: 250,
  cacheStrategy: 'url-params', // Future: 'redis' | 'swr'
  
  // Filter definitions — add new filters here, UI auto-generates
  filters: {
    propertyType: {
      key: 'propertyType',
      apiParam: 'propertyType',
      label: 'Property Type',
      type: 'multi-select',
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
      type: 'single-select',
      options: [
        { label: 'Owner', value: 'owner' },
        { label: 'Builder', value: 'builder' },
        { label: 'Agent', value: 'agent' },
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
    approval: {
      key: 'approval',
      apiParam: 'approval',
      label: 'Approval Status',
      type: 'single-select',
      options: [
        { label: 'Approved', value: 'approved' },
        { label: 'Pending', value: 'pending' },
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

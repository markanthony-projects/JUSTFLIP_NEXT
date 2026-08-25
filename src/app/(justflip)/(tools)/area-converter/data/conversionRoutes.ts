export const CONVERSION_ROUTES: Record<
    string,
    {
        category: 'area' | 'length';
        from: string;
        to: string;
    }
> = {
    'sqft-to-sqm': {
        category: 'area',
        from: 'sqft',
        to: 'sqm',
    },

    'sqm-to-sqft': {
        category: 'area',
        from: 'sqm',
        to: 'sqft',
    },

    'sqft-to-gaj': {
        category: 'area',
        from: 'sqft',
        to: 'gaj',
    },

    'sqft-to-acre': {
        category: 'area',
        from: 'sqft',
        to: 'acre',
    },

    'acre-to-hectare': {
        category: 'area',
        from: 'acre',
        to: 'hectare',
    },

    'gaj-to-sqm': {
        category: 'area',
        from: 'gaj',
        to: 'sqm',
    },

    'gaj-to-sqft': {
        category: 'area',
        from: 'gaj',
        to: 'sqft',
    },

    'gaj-to-bigha': {
        category: 'area',
        from: 'gaj',
        to: 'bigha',
    },
};
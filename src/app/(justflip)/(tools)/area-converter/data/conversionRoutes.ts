export const CONVERSION_ROUTES: Record<
    string,
    {
        category: 'area' | 'length';
        from: string;
        to: string;
    }
> = {
    // =========================
    // SQUARE FEET
    // =========================
    'sqft-to-sqm': {
        category: 'area',
        from: 'sqft',
        to: 'sqm',
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
    'sqft-to-sq-yard': {
        category: 'area',
        from: 'sqft',
        to: 'sq-yard',
    },
    'sqft-to-cent': {
        category: 'area',
        from: 'sqft',
        to: 'cent',
    },

    // =========================
    // SQUARE METER
    // =========================
    'sqm-to-sqft': {
        category: 'area',
        from: 'sqm',
        to: 'sqft',
    },
    'sqm-to-gaj': {
        category: 'area',
        from: 'sqm',
        to: 'gaj',
    },
    'sqm-to-acre': {
        category: 'area',
        from: 'sqm',
        to: 'acre',
    },
    'sqm-to-hectare': {
        category: 'area',
        from: 'sqm',
        to: 'hectare',
    },
    'sqm-to-cent': {
        category: 'area',
        from: 'sqm',
        to: 'cent',
    },

    // =========================
    // ACRE
    // =========================
    'acre-to-hectare': {
        category: 'area',
        from: 'acre',
        to: 'hectare',
    },
    'acre-to-sqm': {
        category: 'area',
        from: 'acre',
        to: 'sqm',
    },
    'acre-to-sqft': {
        category: 'area',
        from: 'acre',
        to: 'sqft',
    },
    'acre-to-bigha': {
        category: 'area',
        from: 'acre',
        to: 'bigha',
    },
    'acre-to-cent': {
        category: 'area',
        from: 'acre',
        to: 'cent',
    },

    // =========================
    // HECTARE
    // =========================
    'hectare-to-sqm': {
        category: 'area',
        from: 'hectare',
        to: 'sqm',
    },
    'hectare-to-sqft': {
        category: 'area',
        from: 'hectare',
        to: 'sqft',
    },
    'hectare-to-acre': {
        category: 'area',
        from: 'hectare',
        to: 'acre',
    },
    'hectare-to-bigha': {
        category: 'area',
        from: 'hectare',
        to: 'bigha',
    },
    'hectare-to-cent': {
        category: 'area',
        from: 'hectare',
        to: 'cent',
    },

    // =========================
    // GAJ
    // =========================
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
    'gaj-to-sq-yard': {
        category: 'area',
        from: 'gaj',
        to: 'sq-yard',
    },
    'gaj-to-biswa': {
        category: 'area',
        from: 'gaj',
        to: 'biswa',
    },

    // =========================
    // BIGHA
    // =========================
    'bigha-to-sqft': {
        category: 'area',
        from: 'bigha',
        to: 'sqft',
    },
    'bigha-to-gaj': {
        category: 'area',
        from: 'bigha',
        to: 'gaj',
    },
    'bigha-to-acre': {
        category: 'area',
        from: 'bigha',
        to: 'acre',
    },
    'bigha-to-hectare': {
        category: 'area',
        from: 'bigha',
        to: 'hectare',
    },
    'bigha-to-katha': {
        category: 'area',
        from: 'bigha',
        to: 'katha',
    },

    // =========================
    // SQUARE YARD
    // =========================
    'sq-yard-to-sqft': {
        category: 'area',
        from: 'sq-yard',
        to: 'sqft',
    },
    'sq-yard-to-sqm': {
        category: 'area',
        from: 'sq-yard',
        to: 'sqm',
    },
    'sq-yard-to-acre': {
        category: 'area',
        from: 'sq-yard',
        to: 'acre',
    },
    'sq-yard-to-gaj': {
        category: 'area',
        from: 'sq-yard',
        to: 'gaj',
    },
    'sq-yard-to-cent': {
        category: 'area',
        from: 'sq-yard',
        to: 'cent',
    },

    // =========================
    // CENT
    // =========================
    'cent-to-sqft': {
        category: 'area',
        from: 'cent',
        to: 'sqft',
    },
    'cent-to-sqm': {
        category: 'area',
        from: 'cent',
        to: 'sqm',
    },
    'cent-to-acre': {
        category: 'area',
        from: 'cent',
        to: 'acre',
    },
    'cent-to-hectare': {
        category: 'area',
        from: 'cent',
        to: 'hectare',
    },
    'cent-to-sq-yard': {
        category: 'area',
        from: 'cent',
        to: 'sq-yard',
    },

    // =========================
    // KATHA
    // =========================
    'katha-to-sqft': {
        category: 'area',
        from: 'katha',
        to: 'sqft',
    },
    'katha-to-gaj': {
        category: 'area',
        from: 'katha',
        to: 'gaj',
    },
    'katha-to-acre': {
        category: 'area',
        from: 'katha',
        to: 'acre',
    },
    'katha-to-bigha': {
        category: 'area',
        from: 'katha',
        to: 'bigha',
    },
    'katha-to-decimal': {
        category: 'area',
        from: 'katha',
        to: 'decimal',
    },

    // =========================
    // GUNTHA
    // =========================
    'guntha-to-sqft': {
        category: 'area',
        from: 'guntha',
        to: 'sqft',
    },
    'guntha-to-sqm': {
        category: 'area',
        from: 'guntha',
        to: 'sqm',
    },
    'guntha-to-acre': {
        category: 'area',
        from: 'guntha',
        to: 'acre',
    },
    'guntha-to-bigha': {
        category: 'area',
        from: 'guntha',
        to: 'bigha',
    },
    'guntha-to-katha': {
        category: 'area',
        from: 'guntha',
        to: 'katha',
    },

    // =========================
    // LENGTH
    // =========================
    'meter-to-feet': {
        category: 'length',
        from: 'meter',
        to: 'feet',
    },
    'feet-to-meter': {
        category: 'length',
        from: 'feet',
        to: 'meter',
    },
    'inches-to-cm': {
        category: 'length',
        from: 'inches',
        to: 'cm',
    },
    'mm-to-inches': {
        category: 'length',
        from: 'mm',
        to: 'inches',
    },
    'cm-to-feet': {
        category: 'length',
        from: 'cm',
        to: 'feet',
    },

    'inches-to-feet': {
        category: 'length',
        from: 'inches',
        to: 'feet',
    },
    'inches-to-mm': {
        category: 'length',
        from: 'inches',
        to: 'mm',
    },
    'feet-to-cm': {
        category: 'length',
        from: 'feet',
        to: 'cm',
    },
    'cm-to-inches': {
        category: 'length',
        from: 'cm',
        to: 'inches',
    },

    // =========================
    // VOLUME
    // =========================
    'cubic-feet-to-cubic-meter': {
        category: 'length',
        from: 'cubic-feet',
        to: 'cubic-meter',
    },

    'meter-to-cm': {
        category: 'length',
        from: 'meter',
        to: 'cm',
    },
    'meter-to-inches': {
        category: 'length',
        from: 'meter',
        to: 'inches',
    },
    'mm-to-cm': {
        category: 'length',
        from: 'mm',
        to: 'cm',
    },

    // =========================
    // ADDITIONAL AREA
    // =========================
    'hectare-to-dismil': {
        category: 'area',
        from: 'hectare',
        to: 'dismil',
    },
    'ares-to-cent': {
        category: 'area',
        from: 'ares',
        to: 'cent',
    },
};
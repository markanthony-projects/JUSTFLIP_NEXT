import axios from "axios";

/**
 * Maps Google Places API types to OpenStreetMap Overpass tags.
 */
const TAG_MAPPING: Record<string, string> = {
  hospital: 'amenity=hospital',
  shopping_mall: 'shop=mall',
  church: 'amenity=place_of_worship',
  transit_station: 'public_transport=station',
  restaurant: 'amenity=restaurant',
  city_hall: 'amenity=townhall',
  school: 'amenity=school',
  bank: 'amenity=bank',
  tourist_attraction: 'tourism=attraction',
  park: 'leisure=park',
  bus_station: 'amenity=bus_station',
  airport: 'aeroway=aerodrome',
  train_station: 'railway=station',
  supermarket: 'shop=supermarket',
  movie_theater: 'amenity=cinema',
};

// Expanded mirror list for better load balancing
const OVERPASS_MIRRORS = [
  "https://lz4.overpass-api.de/api/interpreter",
  "https://z.overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass-api.de/api/interpreter" // The main one is usually most loaded, try last
];

// Simple in-memory cache to prevent redundant requests
const requestCache = new Map<string, any>();

export interface LocationParams {
  lat: number;
  lng: number;
}

export interface TransformedPlace {
  name: string;
  vicinity: string;
  geometry: {
    location: {
      lat: () => number | undefined;
      lng: () => number | undefined;
    };
  };
  id: number;
  name_only?: string;
  tags: Record<string, string>;
}

const transformElement = (el: any, type: string): TransformedPlace => ({
  name: el.tags.name || el.tags.operator || type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' '),
  vicinity: el.tags['addr:full'] || el.tags['addr:street'] || "",
  geometry: {
    location: {
      lat: () => el.lat || el.center?.lat,
      lng: () => el.lon || el.center?.lon,
    },
  },
  id: el.id,
  name_only: el.tags.name,
  tags: el.tags
});

/**
 * Fetches nearby places from OpenStreetMap using the Overpass API.
 */
export const fetchNearbyPlaces = async (
  { lat, lng }: LocationParams, 
  type: string, 
  radius: number = 5000
): Promise<TransformedPlace[]> => {
  const cacheKey = `${lat}-${lng}-${type}-${radius}`;
  if (requestCache.has(cacheKey)) return requestCache.get(cacheKey);

  const tag = TAG_MAPPING[type] || `amenity=${type}`;
  const query = `[out:json][timeout:25];(node[${tag}](around:${radius},${lat},${lng});way[${tag}](around:${radius},${lat},${lng});relation[${tag}](around:${radius},${lat},${lng}););out center;`;

  try {
    const response = await fetchWithRetry(query);
    const results = response?.data?.elements?.map((el: any) => transformElement(el, type)) || [];
    requestCache.set(cacheKey, results);
    return results;
  } catch (error) {
    console.error("OSM Fetch Error:", error);
    return [];
  }
};

/**
 * Fetches multiple categories of nearby places in a single Overpass query.
 */
export const fetchNearbyPlacesBatch = async (
  { lat, lng }: LocationParams, 
  types: string[], 
  radius: number = 5000
): Promise<Record<string, TransformedPlace[]>> => {
  const sortedTypes = types.sort()

  const cacheKey = `${lat.toFixed(4)}-${lng.toFixed(4)}-${sortedTypes.join(',')}-${radius}`;
  
  const cached = requestCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const subQueries = sortedTypes.map(type => {
    const tag = TAG_MAPPING[type] || `amenity=${type}`;
    return `
      node[${tag}](around:${radius},${lat},${lng});
      way[${tag}](around:${radius},${lat},${lng});
      relation[${tag}](around:${radius},${lat},${lng});`;
  }).join('');

  const query = `[out:json][timeout:50];(${subQueries});out center;`;

  try {
    const response = await fetchWithRetry(query);
    if (!response || !response.data || !response.data.elements) return {};

    const resultsMap: Record<string, TransformedPlace[]> = {};
    sortedTypes.forEach(type => resultsMap[type] = []);

    response.data.elements.forEach((el: any) => {
      for (const type of sortedTypes) {
        const tag = TAG_MAPPING[type];
        if (!tag || !el.tags) continue;
        const [key, val] = tag.split('=');
        if (el.tags[key] === val) {
          resultsMap[type].push(transformElement(el, type));
          break; 
        }
      }
    });

    requestCache.set(cacheKey, resultsMap);
    return resultsMap;
  } catch (error) {
    console.error("OSM Batch Fetch Error:", error);
    return {};
  }
};

/**
 * Helper to try multiple mirrors with a fallback strategy.
 */
async function fetchWithRetry(query: string): Promise<any> {
  // Shuffle mirrors to distribute load
  const shuffledMirrors = [...OVERPASS_MIRRORS].sort(() => Math.random() - 0.5);
  
  for (const mirror of shuffledMirrors) {
    try {
      const response = await axios.get(mirror, { 
        params: { data: query }, 
        timeout: 25000 // Faster timeout to failover quickly
      });
      return response;
    } catch (e: any) {
      if (e.response?.status === 429) {
        console.warn(`Mirror ${mirror} is rate limited, trying next...`);
      } else {
        console.warn(`Mirror ${mirror} failed: ${e.message}`);
      }
    }
  }
  throw new Error("All Overpass mirrors failed or are rate-limited.");
}

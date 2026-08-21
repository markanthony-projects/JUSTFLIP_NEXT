import axios from "axios";

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
  distance?: number;
  formattedDistance?: string;
}

const clientCache = new Map<string, Record<string, TransformedPlace[]>>();

function transformRawPlace(raw: any): TransformedPlace {
  const pLat = raw.lat;
  const pLng = raw.lng;

  return {
    name: raw.name,
    vicinity: raw.vicinity || "",
    geometry: {
      location: {
        lat: () => pLat,
        lng: () => pLng,
      },
    },
    id: raw.id,
    name_only: raw.name,
    tags: raw.tags || {},
    distance: raw.distance,
    formattedDistance: raw.formattedDistance,
  };
}

/**
 * Fetches multiple categories of genuine nearby places via the server-side API route.
 */
export const fetchNearbyPlacesBatch = async (
  { lat, lng }: LocationParams,
  types: string[],
  radius: number = 8000
): Promise<Record<string, TransformedPlace[]>> => {
  const sortedTypes = [...types].sort();
  const cacheKey = `${lat.toFixed(3)}-${lng.toFixed(3)}-${sortedTypes.join(",")}-${radius}`;

  if (clientCache.has(cacheKey)) {
    return clientCache.get(cacheKey)!;
  }

  const resultsMap: Record<string, TransformedPlace[]> = {};
  sortedTypes.forEach((type) => (resultsMap[type] = []));

  try {
    const response = await axios.get("/api/nearby-places", {
      params: {
        lat,
        lng,
        types: sortedTypes.join(","),
        radius,
      },
      timeout: 20000,
    });

    if (response?.data?.success && response.data.data) {
      const serverData = response.data.data;
      for (const type of sortedTypes) {
        const rawList = serverData[type] || [];
        resultsMap[type] = rawList.map(transformRawPlace);
      }
    }
  } catch (error) {
    console.warn("Failed to fetch nearby places from server route:", error);
  }

  clientCache.set(cacheKey, resultsMap);
  return resultsMap;
};

/**
 * Fetches a single category of genuine nearby places.
 */
export const fetchNearbyPlaces = async (
  { lat, lng }: LocationParams,
  type: string,
  radius: number = 8000
): Promise<TransformedPlace[]> => {
  const batch = await fetchNearbyPlacesBatch({ lat, lng }, [type], radius);
  return batch[type] || [];
};






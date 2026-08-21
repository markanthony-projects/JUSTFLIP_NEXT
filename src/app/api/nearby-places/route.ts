import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Overpass tag mapping for various amenities & landmarks
const TAG_MAPPING: Record<string, string[]> = {
  hospital: ["amenity=hospital", "amenity=clinic", "healthcare=hospital", "healthcare=clinic"],
  shopping_mall: ["shop=mall", "shop=department_store"],
  church: ["amenity=place_of_worship"],
  temple: ["amenity=place_of_worship", "building=temple"],
  atm: ["amenity=atm"],
  transit_station: ["public_transport=station", "railway=station"],
  restaurant: ["amenity=restaurant", "amenity=fast_food", "amenity=cafe"],
  city_hall: ["amenity=townhall"],
  school: ["amenity=school", "amenity=college", "amenity=kindergarten"],
  bank: ["amenity=bank"],
  tourist_attraction: ["tourism=attraction", "historic=monument"],
  park: ["leisure=park", "leisure=garden", "leisure=recreation_ground", "leisure=pitch"],
  post_office: ["amenity=post_office"],
  fuel: ["amenity=fuel"],
  petrol_pump: ["amenity=fuel"],
  bus_station: ["amenity=bus_station", "highway=bus_stop"],
  airport: ["aeroway=aerodrome"],
  train_station: ["railway=station", "railway=subway_entrance", "station=subway"],
  supermarket: ["shop=supermarket", "shop=convenience", "shop=grocery"],
  movie_theater: ["amenity=cinema"],
  cinema_hall: ["amenity=cinema"],
  hotel: ["tourism=hotel", "tourism=guest_house", "amenity=hotel"],
};

const CATEGORY_SEARCH_KEYWORDS: Record<string, string[]> = {
  school: ["school", "college"], //
  hospital: ["hospital", "clinic"],//
  hotel: ["hotel", "resort", "lodging"], //
  park: ["park", "garden"], //
  shopping_mall: ["mall", "shopping center"],
  atm: ["atm", "bank atm"], //
  temple: ["temple", "mandir"], //
  bank: ["bank"], //
  fuel: ["petrol pump", "gas station"],
  petrol_pump: ["petrol pump", "gas station"],  //
  bus_station: ["bus stand", "bus stop"],
  train_station: ["metro station", "railway station"],
  supermarket: ["supermarket", "grocery store"], //
  cinema_hall: ["cinema", "theatre"],
  movie_theater: ["cinema", "theatre"],
  post_office: ["post office"], //
};

const OVERPASS_MIRRORS = [
  "https://lz4.overpass-api.de/api/interpreter",
  "https://z.overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass-api.de/api/interpreter",
];

// In-memory server-side cache (24-hour TTL)
interface CacheEntry {
  data: Record<string, any[]>;
  timestamp: number;
}
const serverCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Fast search using Nominatim bounding box
 */
async function fetchFromNominatim(
  lat: number,
  lng: number,
  radius: number,
  type: string,
  keyword: string
): Promise<any[]> {
  const delta = (radius / 111320) * 1.2;
  const left = lng - delta;
  const right = lng + delta;
  const top = lat + delta;
  const bottom = lat - delta;
  const maxRadiusKm = radius / 1000;

  try {
    const res = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: keyword,
        format: "json",
        viewbox: `${left},${top},${right},${bottom}`,
        bounded: 1,
        limit: 8,
      },
      headers: { "User-Agent": "JustFlip-App/1.0" },
      timeout: 3000,
    });

    if (Array.isArray(res.data)) {
      return res.data
        .map((item: any) => {
          const pLat = parseFloat(item.lat);
          const pLng = parseFloat(item.lon);
          if (isNaN(pLat) || isNaN(pLng)) return null;

          const dist = calculateDistanceKm(lat, lng, pLat, pLng);
          if (dist > maxRadiusKm) return null;

          const rawName = item.display_name.split(",")[0] || item.name || keyword;
          return {
            id: item.place_id || Math.floor(Math.random() * 1000000),
            name: rawName,
            vicinity: item.display_name,
            lat: pLat,
            lng: pLng,
            tags: { name: rawName },
            distance: dist,
            formattedDistance: `${dist.toFixed(2)} KM`,
          };
        })
        .filter(Boolean);
    }
  } catch (e) {}
  return [];
}

/**
 * Fast search using Photon API
 */
async function fetchFromPhoton(
  lat: number,
  lng: number,
  radius: number,
  keyword: string
): Promise<any[]> {
  const maxRadiusKm = radius / 1000;
  try {
    const res = await axios.get("https://photon.komoot.io/api/", {
      params: {
        q: keyword,
        lat: lat,
        lon: lng,
        limit: 8,
      },
      headers: { "User-Agent": "JustFlip-App/1.0" },
      timeout: 2500,
    });

    if (Array.isArray(res?.data?.features)) {
      return res.data.features
        .map((feat: any) => {
          const coords = feat.geometry?.coordinates;
          if (!coords || coords.length < 2) return null;
          const pLng = coords[0];
          const pLat = coords[1];
          if (isNaN(pLat) || isNaN(pLng)) return null;

          const dist = calculateDistanceKm(lat, lng, pLat, pLng);
          if (dist > maxRadiusKm) return null;

          const props = feat.properties || {};
          const name = props.name || props.street || keyword;
          const vicinity = [props.street, props.district, props.city, props.state]
            .filter(Boolean)
            .join(", ");

          return {
            id: props.osm_id || Math.floor(Math.random() * 1000000),
            name: name,
            vicinity: vicinity || name,
            lat: pLat,
            lng: pLng,
            tags: { name: name },
            distance: dist,
            formattedDistance: `${dist.toFixed(2)} KM`,
          };
        })
        .filter(Boolean);
    }
  } catch (e) {}
  return [];
}

/**
 * Parallel fast Overpass query with short timeout
 */
async function fetchFromOverpassFast(
  lat: number,
  lng: number,
  radius: number,
  types: string[]
): Promise<Record<string, any[]>> {
  const query = `[out:json][timeout:3];
(
  nwr(around:${radius},${lat},${lng})["amenity"~"school|college|kindergarten|hospital|clinic|atm|bank|fuel|bus_station|cinema|place_of_worship|post_office"];
  nwr(around:${radius},${lat},${lng})["leisure"~"park|garden|recreation_ground|pitch"];
  nwr(around:${radius},${lat},${lng})["shop"~"mall|department_store|supermarket|convenience|grocery"];
  nwr(around:${radius},${lat},${lng})["railway"~"station|subway_entrance"];
);
out center 60;`;

  const results: Record<string, any[]> = {};
  types.forEach((t) => (results[t] = []));
  const maxRadiusKm = radius / 1000;

  try {
    const mirrorPromises = OVERPASS_MIRRORS.map((m) =>
      axios.get(m, {
        params: { data: query },
        timeout: 2000,
        headers: { "User-Agent": "JustFlip-App/1.0", Accept: "application/json" },
      })
    );

    const response = await Promise.any(mirrorPromises);
    const elements = response?.data?.elements || [];

    elements.forEach((el: any) => {
      const name =
        el.tags?.name ||
        el.tags?.["name:en"] ||
        el.tags?.operator ||
        el.tags?.brand;

      if (!name || name.trim().length === 0) return;

      const pLat = el.lat ?? el.center?.lat;
      const pLng = el.lon ?? el.center?.lon;
      if (pLat === undefined || pLng === undefined || isNaN(pLat) || isNaN(pLng)) return;

      const dist = calculateDistanceKm(lat, lng, pLat, pLng);
      if (dist > maxRadiusKm) return;

      for (const type of types) {
        const tags = TAG_MAPPING[type] || [`amenity=${type}`];
        const matches = tags.some((tag) => {
          const [k, v] = tag.split("=");
          return el.tags && el.tags[k] && el.tags[k].toLowerCase().includes(v.toLowerCase());
        });

        if (matches) {
          results[type].push({
            id: el.id,
            name: name.trim(),
            vicinity: el.tags?.["addr:full"] || el.tags?.["addr:street"] || el.tags?.["addr:suburb"] || "",
            lat: pLat,
            lng: pLng,
            tags: el.tags || {},
            distance: dist,
            formattedDistance: `${dist.toFixed(2)} KM`,
          });
          break;
        }
      }
    });
  } catch (e) {
    // Overpass failed or timed out — silently fallback to Nominatim & Photon
  }

  return results;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const latStr = searchParams.get("lat");
    const lngStr = searchParams.get("lng");
    const typesParam = searchParams.get("types") || "school,hospital,park,shopping_mall";
    const radiusStr = searchParams.get("radius") || "8000";

    const lat = parseFloat(latStr || "");
    const lng = parseFloat(lngStr || "");
    const radius = parseInt(radiusStr, 10) || 8000;
    const maxRadiusKm = radius / 1000;

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json({ error: "Invalid lat/lng parameters" }, { status: 400 });
    }

    const types = typesParam
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    // Cache key rounded to ~100m grid for fast localized hits
    const cacheKey = `${lat.toFixed(3)}_${lng.toFixed(3)}_${[...types].sort().join(",")}_${radius}`;
    const cached = serverCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json({ success: true, data: cached.data, cached: true });
    }

    const resultsMap: Record<string, any[]> = {};
    types.forEach((type) => (resultsMap[type] = []));

    // Run parallel Nominatim + Photon searches + quick Overpass attempt
    const overpassPromise = fetchFromOverpassFast(lat, lng, radius, types);

    const geoQueriesPromises = types.map(async (type) => {
      const keywords = CATEGORY_SEARCH_KEYWORDS[type] || [type];
      const primaryKeyword = keywords[0];

      // Query Nominatim and Photon in parallel for maximum reliability and speed
      const [nomResults, photonResults] = await Promise.all([
        fetchFromNominatim(lat, lng, radius, type, primaryKeyword),
        fetchFromPhoton(lat, lng, radius, primaryKeyword),
      ]);

      const combined = [...nomResults, ...photonResults];

      // If still empty and secondary keyword exists, try secondary
      if (combined.length === 0 && keywords.length > 1) {
        const secondaryKeyword = keywords[1];
        const secondaryResults = await fetchFromPhoton(lat, lng, radius, secondaryKeyword);
        combined.push(...secondaryResults);
      }

      return { type, items: combined };
    });

    const [overpassResults, geoResults] = await Promise.all([
      overpassPromise,
      Promise.all(geoQueriesPromises),
    ]);

    // Merge Overpass results
    for (const type of types) {
      if (overpassResults[type] && overpassResults[type].length > 0) {
        resultsMap[type].push(...overpassResults[type]);
      }
    }

    // Merge Geo results
    for (const { type, items } of geoResults) {
      if (items && items.length > 0) {
        resultsMap[type].push(...items);
      }
    }

    // Deduplicate & sort ascending by distance, cap to top 5
    for (const type of types) {
      const list = resultsMap[type] || [];
      const unique: any[] = [];
      const seen = new Set<string>();

      for (const p of list) {
        const nameKey = p.name.toLowerCase().trim();
        // Strict guard: NEVER allow distance > maxRadiusKm
        if (p.distance <= maxRadiusKm && !seen.has(nameKey)) {
          seen.add(nameKey);
          unique.push(p);
        }
      }

      unique.sort((a, b) => a.distance - b.distance);
      resultsMap[type] = unique.slice(0, 5);
    }

    // Save to in-memory server cache
    serverCache.set(cacheKey, { data: resultsMap, timestamp: Date.now() });

    return NextResponse.json({
      success: true,
      data: resultsMap,
      cached: false,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch nearby places" },
      { status: 500 }
    );
  }
}

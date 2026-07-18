import SiteService from "@/src/services/SiteService";

// Mapping of URL-friendly property type terms to API values
const PROPERTY_TYPE_MAP = {
  'flats': 'apartment',
  'flat': 'apartment',
  'apartments': 'apartment',
  'apartment': 'apartment',
  'villas': 'villa',
  'villa': 'villa',
  'plots': 'plot',
  'plot': 'plot',
  'commercial': 'commercial',
  'properties': '', // Generic, no type filter
  'property': ''
};

const STATIC_CITY_LIST = [
  'bangalore', 'bengaluru', 'mumbai', 'delhi', 'noida', 'gurgaon', 'gurugram', 'new-delhi',
  'hyderabad', 'chennai', 'pune', 'kolkata', 'dubai', 'mysuru', 'mysore', 'ahmedabad', 
  'surat', 'jaipur', 'lucknow', 'kanpur', 'nagpur', 'indore', 'thane', 'bhopal', 
  'visakhapatnam', 'patna', 'vadodara', 'ghaziabad', 'ludhiana', 'agra', 'nashik', 
  'faridabad', 'meerut', 'rajkot', 'kalyan-dombivli', 'vasai-virar', 'varanasi', 
  'srinagar', 'aurangabad', 'dhanbad', 'amritsar', 'navi-mumbai', 'allahabad', 
  'ranchi', 'howrah', 'coimbatore', 'jabalpur', 'gwalior', 'vijayawada', 'jodhpur', 
  'madurai', 'raipur', 'kota', 'guwahati', 'chandigarh', 'solapur', 'hubballi-dharwad',
  'bareilly', 'moradabad', 'tiruchirappalli', 'tiruppur', 'kochi', 'trivandrum', 'thiruvananthapuram'
]; // Ideally fetch from API, but hardcoded fallback for synchronous parsing

let CACHED_CITY_LIST = null;

export async function parseSlugToFilters(slugArray) {
  if (!slugArray || slugArray.length === 0) return null;

  let dynamicCityList = [];
  try {
    if (CACHED_CITY_LIST) {
      dynamicCityList = CACHED_CITY_LIST;
    } else {
      const response = await SiteService.fetchPopularCities({ offset: 0, limit: 100 });
      dynamicCityList = (response?.cities || []).map(c => c?.name?.toLowerCase()).filter(Boolean);
      if (dynamicCityList.length > 0) {
        CACHED_CITY_LIST = dynamicCityList;
      }
    }
  } catch (error) {
    console.error("Failed to fetch cities for slug parser, falling back to static list", error);
  }

  const CITY_LIST = dynamicCityList.length > 0 ? dynamicCityList : STATIC_CITY_LIST;

  const slug = slugArray.join('/'); // Just in case it's nested, but mostly 1 segment
  const lowerSlug = slug.toLowerCase();

  // Pattern 1: {bhk}-bhk-{type}-in-{locality}-{city}  OR {bhk}-bhk-in-{locality}-{city}
  // Pattern 2: {type}-in-{locality}-{city}
  // Pattern 3: {type}-near-{metro}-metro-{city}
  // Pattern 4: {type}-in-{city}

  // We split by '-in-' or '-near-'
  let locationPart = '';
  let typePart = '';
  let isNear = false;

  if (lowerSlug.includes('-in-')) {
    const parts = lowerSlug.split('-in-');
    typePart = parts[0];
    locationPart = parts.slice(1).join('-in-'); // in case locality has '-in-'
  } else if (lowerSlug.includes('-near-')) {
    const parts = lowerSlug.split('-near-');
    typePart = parts[0];
    locationPart = parts.slice(1).join('-near-');
    isNear = true;
  } else {
    // If it doesn't match standard SEO format, return null to trigger 404
    return null;
  }

  const filters = {};

  // Parse Type Part (e.g. "2-bhk-flats" or "flats" or "2-bhk")
  const typeTokens = typePart.split('-');
  
  // Extract BHK
  const bhkIndex = typeTokens.indexOf('bhk');
  if (bhkIndex > 0) {
    const bhkValue = parseInt(typeTokens[bhkIndex - 1]);
    if (!isNaN(bhkValue)) {
      filters.bhk = bhkValue;
    }
  }

  // Extract Property Type (last token of typePart usually, unless it's just "properties" or "2-bhk")
  const potentialType = typeTokens[typeTokens.length - 1];
  if (PROPERTY_TYPE_MAP[potentialType] !== undefined) {
    const apiType = PROPERTY_TYPE_MAP[potentialType];
    if (apiType) {
      filters.propertyType = apiType;
    }
  }

  // Parse Location Part (e.g. "indira-nagar-bangalore" or "bangalore")
  const locTokens = locationPart.split('-');
  
  // Find City (assume last token is city, check against known list. If city is 2 words, check last 2)
  let city = '';
  let localityTokens = [];

  const lastToken = locTokens[locTokens.length - 1];
  const lastTwoTokens = locTokens.length > 1 ? `${locTokens[locTokens.length - 2]}-${locTokens[locTokens.length - 1]}` : '';

  if (CITY_LIST.includes(lastTwoTokens)) {
    city = lastTwoTokens.replace('-', ' ');
    localityTokens = locTokens.slice(0, -2);
  } else if (CITY_LIST.includes(lastToken) || lastToken === 'bengaluru') {
    city = lastToken;
    localityTokens = locTokens.slice(0, -1);
  } else {
    // If we can't reliably extract a known city, it might be an invalid SEO route
    // But to be robust, we'll just treat the last token as city
    city = lastToken;
    localityTokens = locTokens.slice(0, -1);
  }

  // Set city filter (map bengaluru back to Bangalore if needed, or rely on API fuzzy match)
  filters.city = city.replace(/\b\w/g, l => l.toUpperCase());

  // Extract Locality or Metro
  if (localityTokens.length > 0) {
    if (isNear && localityTokens[localityTokens.length - 1] === 'metro') {
      localityTokens.pop(); // remove 'metro' word
    }
    const locality = localityTokens.join(' ').replace(/\b\w/g, l => l.toUpperCase());
    filters.search = locality; // Map locality to existing 'search' parameter
  } else {
    // If no locality, use city as search term so the backend city filter triggers
    filters.search = filters.city;
  }

  return filters;
}

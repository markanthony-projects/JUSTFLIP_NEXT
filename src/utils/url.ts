import { formatUrl } from "./URLFormatter";


const capitalize = (str: string = ""): string => str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
const capitalizeWords = (str: string = ""): string => str.split("-").filter(Boolean).map(word => capitalize(word)).join(" ");

export const createSlug = (name: string = ""): string => {
  return name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
};


export const createCityUrl = (name: string, id: string | number): string => {
  if (!name || !id) return "";

  const slug = createSlug(name);
  return `/properties/${slug}-${id}`;
};


export const parseCityUrl = (slugParam: string = ""): { name: string; id: string } => {
  if (!slugParam) {
    return { name: "", id: "" };
  }

  const parts = slugParam.split("-");
  const id = parts.slice(-5).join("-");
  const uni = parts.slice(0, -5).join("-")

  return {
    name: capitalizeWords(uni),
    id,
  };
};


export const createZoneUrl = (cityName: string, name: string, id: string | number): string => {
  if (!cityName || !name || !id) return "";

  const citySlug = formatUrl(cityName);
  const zoneSlug = createSlug(name);

  return `/properties/${citySlug}/${zoneSlug}-${id}`;
};


export const parseZoneUrl = (citySlug: string = "", zoneSlug: string = ""): { cityName: string; name: string; id: string } => {
  return {
    cityName: capitalizeWords(citySlug),
    ...parseCityUrl(zoneSlug),
  };
};

export const createLocationUrl = (cityName: string, zoneName: string, name: string, id: string | number): string => {
  if (!cityName || !name || !id || !zoneName) return "";

  const citySlug = formatUrl(cityName);
  const zoneSlug = formatUrl(zoneName);
  const locationSlug = createSlug(name);

  return `/properties/${citySlug}/${zoneSlug}/${locationSlug}-${id}`;
};

export const parseLocationUrl = (citySlug: string = "", zoneSlug: string = "", locationSlug: string = ""): { cityName: string; zoneName: string; name: string; id: string } => {
  return {
    cityName: capitalizeWords(citySlug),
    zoneName: capitalizeWords(zoneSlug),
    ...parseCityUrl(locationSlug),
  };
};

export const parseProjectUrl = (citySlug: string = "", zoneSlug: string = "", locationSlug: string = "", slug: string = ""): { cityName: string; zoneName: string; locationName: string; name: string; id: string } => {
  return {
    cityName: capitalizeWords(citySlug),
    zoneName: capitalizeWords(zoneSlug),
    locationName: capitalizeWords(locationSlug),
    ...parseCityUrl(slug),
  };
};

export const createProjectUrl = (cityName: string, zoneName: string, locationName: string, name: string, id: string | number): string => {
  if (!cityName || !zoneName || !locationName || !name || !id) return "";

  const citySlug = formatUrl(cityName);
  const zoneSlug = formatUrl(zoneName);
  const locationSlug = formatUrl(locationName);
  const projectSlug = createSlug(name);

  return `/properties/${citySlug}/${zoneSlug}/${locationSlug}/${projectSlug}-${id}`;
};

export const createDeveloperDetailsUrl = (name: string, id: string | number): string => {
 if (!name || !id) return "";

  const slug = createSlug(name);
  return `/developers/${slug}-${id}`;
}

export const parseDevelopersDetailsUrl = (slugParam: string = ""): { name: string; id: string } => {
  if (!slugParam) {
    return { name: "", id: "" };
  }

  const parts = slugParam.split("-");
  const id = parts.slice(-5).join("-");
  const uni = parts.slice(0, -5).join("-")

  return {
    name: capitalizeWords(uni),
    id,
  };
};

export const parseBlogDetailsUrl = (slugParam: string = ""): { name: string; id: string } => {
  if (!slugParam) {
    return { name: "", id: "" };
  }

  const parts = slugParam.split("-");
  const id = parts.slice(-5).join("-");
  const uni = parts.slice(0, -5).join("-")

  return {
    name: capitalizeWords(uni),
    id,
  };
};




import { formatUrl } from "./URLFormatter";


const capitalize = (str = "") => str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
const capitalizeWords = (str = "") => str.split("-").filter(Boolean).map(word => capitalize(word)).join(" ");

export const createSlug = (name = "") => {
  return name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
};


export const createCityUrl = (name, id) => {
  if (!name || !id) return "";

  const slug = createSlug(name);
  return `/properties/${slug}-${id}`;
};


export const parseCityUrl = (slugParam = "") => {
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


export const createZoneUrl = (cityName, name, id) => {
  if (!cityName || !name || !id) return "";

  const citySlug = formatUrl(cityName);
  const zoneSlug = createSlug(name);

  return `/properties/${citySlug}/${zoneSlug}-${id}`;
};


export const parseZoneUrl = (citySlug = "", zoneSlug = "") => {
  return {
    cityName: capitalizeWords(citySlug),
    ...parseCityUrl(zoneSlug),
  };
};

export const createLocationUrl = (cityName, zoneName, name, id) => {
  if (!cityName || !name || !id || !zoneName) return "";

  const citySlug = formatUrl(cityName);
  const zoneSlug = formatUrl(zoneName);
  const locationSlug = createSlug(name);

  return `/properties/${citySlug}/${zoneSlug}/${locationSlug}-${id}`;
};

export const parseLocationUrl = (citySlug = "", zoneSlug = "", locationSlug = "") => {
  return {
    cityName: capitalizeWords(citySlug),
    zoneName: capitalizeWords(zoneSlug),
    ...parseCityUrl(locationSlug),
  };
};

export const parseProjectUrl = (citySlug = "", zoneSlug = "", locationSlug = "", slug) => {
  return {
    cityName: capitalizeWords(citySlug),
    zoneName: capitalizeWords(zoneSlug),
    locationName: capitalizeWords(locationSlug),
    ...parseCityUrl(slug),
  };
};

export const createProjectUrl = (cityName, zoneName, locationName, name, id) => {
  if (!cityName || !zoneName || !locationName || !name || !id) return "";

  const citySlug = formatUrl(cityName);
  const zoneSlug = formatUrl(zoneName);
  const locationSlug = formatUrl(locationName);
  const projectSlug = createSlug(name);

  return `/properties/${citySlug}/${zoneSlug}/${locationSlug}/${projectSlug}-${id}`;
};

export const createDeveloperDetailsUrl = (name , id) =>{
 if (!name || !id) return "";

  const slug = createSlug(name);
  return `/developers/${slug}-${id}`;
}

export const parseDevelopersDetailsUrl = (slugParam = "") => {
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

export const parseBlogDetailsUrl = (slugParam = "") => {
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




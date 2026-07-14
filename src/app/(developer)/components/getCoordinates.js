import { safeNumber } from "./number";

const DEFAULT_BENGALURU = {
  lat: 12.9716,
  lng: 77.5946,
};

export const getCoordinates = (project) => ({
  lat: safeNumber(project?.coordinates?.lat, DEFAULT_BENGALURU.lat),
  lng: safeNumber(project?.coordinates?.lng, DEFAULT_BENGALURU.lng),
});
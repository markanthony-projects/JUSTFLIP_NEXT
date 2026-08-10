export const getQueryParam = (
  type?: string | null,
  typeId?: string | number | null
): Record<string, string | number> => {
  if (!type || !typeId) return {};

  switch (type) {
    case "location":
      return { locationId: typeId };
    case "zone":
      return { zoneId: typeId };
    case "city":
      return { cityId: typeId };
    default:
      return {};
  }
};
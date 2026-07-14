export const getQueryParam = (type, typeId) => {
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
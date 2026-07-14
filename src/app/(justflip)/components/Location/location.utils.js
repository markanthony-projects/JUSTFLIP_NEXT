export const filterServices = (services = [], category, types) => {
  return services?.filter(
    (item) =>
      item?.category === category &&
      (Array.isArray(types)
        ? types.includes(item?.type)
        : item.type === types)
  );
};

export const getTabData = (services, tab) => {
  switch (tab) {
    case "Connectivity":
      return [
        { key: "metro", items: filterServices(services, "connectivity", "metro") },
        { key: "road", items: filterServices(services, "connectivity", "road") },
      ];
    case "Entertainment":
      return [
        { key: "mall", items: filterServices(services, "entertainment", "mall") },
        { key: "movie", items: filterServices(services, "entertainment", "movie") },
      ];
    case "Education":
      return [
        { key: "school", items: filterServices(services, "education", "school") },
        { key: "college", items: filterServices(services, "education", "college") },
      ];
    case "Healthcare":
      return [
        { key: "hospital", items: filterServices(services, "healthcare", "hospital") },
        { key: "clinic", items: filterServices(services, "healthcare", "clinic") },
      ];
    default:
      return [];
  }
};
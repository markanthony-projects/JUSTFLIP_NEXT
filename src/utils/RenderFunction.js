export const getCurrencySymbol = (currency = "INR") => {
  const cur = (currency || "INR").toString().toUpperCase();
  switch (cur) {
    case "INR":
      return "₹";
    case "AED":
      return "Ð";
    case "USD":
      return "$";
    default:
      return "₹";
  }
};


export const convertToCurrency = (price, currency = "INR") => {
  if (price === null || price === undefined || price === "") return "";

  const numeric =
    typeof price === "number"
      ? price
      : parseFloat(String(price).replace(/[^\d.-]/g, ""));

  if (isNaN(numeric)) return String(price);

  const cur = (currency || "INR").toString().toUpperCase();

  if (cur === "INR") {
    const crore = 1e7; 
    const lakh = 1e5; 
    if (numeric >= crore) return `${(numeric / crore).toFixed(2)} Cr`;
    if (numeric >= lakh) return `${(numeric / lakh).toFixed(2)} L`;
    if (numeric >= 1000) return `${(numeric / 1000).toFixed(2)} K`;
    return `${numeric}`; 
  }

  const billion = 1e9;
  const million = 1e6;
  const thousand = 1e3;
  if (numeric >= billion) return `${(numeric / billion).toFixed(2)} B`;
  if (numeric >= million) return `${(numeric / million).toFixed(2)} M`;
  if (numeric >= thousand) return `${(numeric / thousand).toFixed(2)} K`;
  return `${numeric}`;
};

export const getLowestAndHighestPrice = (units = []) => {
  if (!units || !Array.isArray(units) || units.length === 0) {
    return { minPrice: 0, maxPrice: 0 };
  }

  const values = units.flatMap((unit) => {
    const minRaw = unit?.minPrice;
    const maxRaw = unit?.maxPrice;

    const parseVal = (v) =>
      typeof v === "number"
        ? v
        : parseFloat(String(v).replace(/[^\d.-]/g, ""));

    const min = parseVal(minRaw);
    const max = parseVal(maxRaw);
    return [min, max].filter((n) => !isNaN(n));
  });

  if (values.length === 0) return { minPrice: 0, maxPrice: 0 };

  return {
    minPrice: Math.min(...values),
    maxPrice: Math.max(...values),
  };
};


export const getDefaultCurrencyFromUnits = (units = [], fallback = "INR") => {
  if (!Array.isArray(units) || units.length === 0) return fallback;
  for (let i = units.length - 1; i >= 0; i--) {
    if (units[i] && units[i].currency) return units[i].currency;
  }
  return fallback;
};

export const formatDisplayPrice = (price, currency = "INR") => {
  const symbol = getCurrencySymbol(currency);
  const converted = convertToCurrency(price, currency);
  return `${symbol} ${converted}`;
};


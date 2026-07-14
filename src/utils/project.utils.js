export const safeNumber = (value) => {
    if (!value) return 0;
    return parseFloat(String(value).replace(/[^0-9.]/g, "")) || 0;
};

export const formatDate = (timestamp) => {
    if (!timestamp) return "-";
    const date = new Date(timestamp);

    return {
        year: date.getFullYear(),
        month: String(date.getMonth() + 1).padStart(2, "0"),
        day: String(date.getDate()).padStart(2, "0"),
    };
};

export const getCurrencySymbol = (units = []) => {
    const currency =
        units?.find((u) => u?.currency)?.currency?.toUpperCase() || "INR";

    switch (currency) {
        case "USD":
            return "$";
        case "AED":
            return "Ð";
        default:
            return "₹";
    }
};

export const parseUnitType = (type) => {
    if (!type) return { bhk: null, br: null };

    const str = type.toLowerCase();

    return {
        bhk: str.match(/(\d+)\s*bhk/)?.[1] || null,
        br: str.match(/(\d+)\s*br/)?.[1] || null,
    };
};

export const sortUnitTypes = (types = []) => {
  return [...types]
    .filter(Boolean)
    .sort((a, b) => {
      const getValue = (val) => {
        const match = val.match(/[\d.]+/); 
        return match ? parseFloat(match[0]) : 0;
      };

      return getValue(a) - getValue(b);
    });
};
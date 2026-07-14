export const getCurrencySymbol = (currency = "INR") => {
  const map = {
    INR: "₹",
    AED: "Ð",
    USD: "$",
  };
  return map[currency] || "₹";
};

export const calculateAverage = (data = []) => {
  if (!data.length) return 0;

  const total = data.reduce((sum, item) => sum + Number(item.price || 0), 0);
  return Math.round(total / data.length);
};
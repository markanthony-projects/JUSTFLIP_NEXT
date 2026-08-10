export const getCurrencySymbol = (currency: string = "INR"): string => {
  const map: Record<string, string> = {
    INR: "₹",
    AED: "Ð",
    USD: "$",
  };
  return map[currency] || "₹";
};

export const calculateAverage = (data: any[] = []): number => {
  if (!data.length) return 0;

  const total = data.reduce((sum, item) => sum + Number(item.price || 0), 0);
  return Math.round(total / data.length);
};
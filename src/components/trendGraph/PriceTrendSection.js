import PriceTrend from "./PriceTrend.client";

export default function PriceTrendSection({ data }) {
  const pricingData = data?.pricings || [];
  const sortedData = [...pricingData].sort((a, b) => Number(a.year) - Number(b.year));

  if (!sortedData.length) return null;

  return <PriceTrend data={sortedData} />;
}
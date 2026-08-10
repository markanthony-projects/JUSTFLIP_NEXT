import PriceTrend from "./PriceTrend.client";

export interface PriceTrendSectionProps {
  data?: { pricings?: any[] };
}

export default function PriceTrendSection({ data }: PriceTrendSectionProps) {
  const pricingData = data?.pricings || [];
  const sortedData = [...pricingData].sort((a: any, b: any) => Number(a.year) - Number(b.year));

  if (!sortedData.length) return null;

  return <PriceTrend data={sortedData} />;
}
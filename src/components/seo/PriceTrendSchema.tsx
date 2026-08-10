export interface PriceTrendSchemaProps {
  trends?: any[];
}

export default function PriceTrendSchema({ trends = [] }: PriceTrendSchemaProps) {
  if (!trends.length) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Real Estate Price Trends",
    description: "Historical price trends per square foot",
    variableMeasured: "Price per Sq Ft",
    data: trends.map((item: any) => ({
      "@type": "Observation",
      name: `Price in ${item.year}`,
      value: Number(item.price),
      unitText: "INR per Sq Ft",
    })),
  };


  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
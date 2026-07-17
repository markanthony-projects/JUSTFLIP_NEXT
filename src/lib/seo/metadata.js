export function generateSeoMetadata(filters, originalSlug) {
  const { propertyType, search, bhk, city } = filters;

  // Formatting helpers
  const formatType = (type, b) => {
    let base = 'Properties';
    if (type === 'apartment') base = 'Flats';
    if (type === 'villa') base = 'Villas';
    if (type === 'plot') base = 'Plots';
    if (type === 'commercial') base = 'Commercial Properties';

    if (b) {
      return `${b} BHK ${base}`;
    }
    return base;
  };

  const typeStr = formatType(propertyType, bhk);
  let locationStr = city || 'India';
  if (search && city) {
    locationStr = `${search}, ${city}`;
  } else if (search) {
    locationStr = search;
  }

  const title = `Buy ${typeStr} in ${locationStr} - Price, Floor Plans | JustFlip`;
  
  const description = `Explore 500+ verified ${typeStr.toLowerCase()} for sale in ${locationStr}. View exact prices, HD photos, floor plans, and amenities on JustFlip.`;

  return {
    title,
    description,
    canonical: `/${originalSlug}`,
    openGraph: {
      title,
      description,
      url: `https://justflip.in/${originalSlug}`,
      siteName: 'JustFlip',
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

import JustflipService from '@/src/services/JustflipService';

export default async function sitemap() {
  const staticRoutes = [
    {
      url: 'https://justflip.in',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://justflip.in/properties',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://justflip.in/blogs',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  try {
    const cities = await JustflipService.fetchCityList();
    
    // Existing city properties routes
    const cityRoutes = (cities || []).map(city => ({
      url: `https://justflip.in/properties/${city.name?.toLowerCase().replace(/\s+/g, '-')}-${city.id}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    }));

    // New SEO dynamic routes for search combinations
    const seoRoutes = [];
    const propertyTypes = ['flats', 'villas', 'plots', 'properties'];
    
    (cities || []).forEach(city => {
      const citySlug = city.name?.toLowerCase().replace(/\s+/g, '-');
      if (!citySlug) return;
      
      propertyTypes.forEach(type => {
        seoRoutes.push({
          url: `https://justflip.in/${type}-in-${citySlug}`,
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 0.7, // Slightly lower than main city hub pages
        });
      });
    });

    return [...staticRoutes, ...cityRoutes, ...seoRoutes];
  } catch (error) {
    return staticRoutes;
  }
}

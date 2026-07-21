import JustflipService from '@/src/services/JustflipService';
import { JUSTFLIP } from '@/src/lib/axios/api';

export async function generateSitemaps() {
  // Returns an array of sitemap fragments to generate multiple sitemaps
  return [
    { id: 'static' },
    { id: 'cities' },
    { id: 'properties' },
    { id: 'zones' },
    { id: 'localities' },
    { id: 'blogs' },
    { id: 'developers' }
  ];
}

const formatUrlStr = (text) => {
    if (!text || typeof text !== "string") return "unknown";
    return text.toLowerCase().trim().replace(/\s+/g, "-");
};

const createSlugStr = (name = "") => {
  return name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
};

export default async function sitemap({ id }) {
  const baseUrl = 'https://justflip.in';

  if (id === 'static') {
    return [
      { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
      { url: `${baseUrl}/properties`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
      { url: `${baseUrl}/blogs`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
      { url: `${baseUrl}/about-us`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
      { url: `${baseUrl}/contact-us`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
      { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
      { url: `${baseUrl}/terms-conditions`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 }
    ];
  }

  if (id === 'cities') {
    const cities = await JustflipService.fetchCityList();
    const cityRoutes = (cities || []).map(city => {
      const citySlug = createSlugStr(city.name);
      return {
        url: `${baseUrl}/properties/${citySlug}-${city.id}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      };
    });

    const seoRoutes = [];
    const propertyTypes = ['flats', 'villas', 'plots', 'properties'];
    (cities || []).forEach(city => {
      const citySlug = createSlugStr(city.name);
      if (citySlug) {
        propertyTypes.forEach(type => {
          seoRoutes.push({
            url: `${baseUrl}/${type}-in-${citySlug}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.7,
          });
        });
      }
    });
    return [...cityRoutes, ...seoRoutes];
  }

  if (id === 'properties') {
    let projects = [];
    try {
      const { data } = await JUSTFLIP.get(`/project`, {
          params: { status: "active", approval: "approved", limit: 10000, page: 1 }
      });
      projects = data?.projects || [];
    } catch (e) {}

    return projects.map(p => {
      if (!p.city?.name || !p.zone?.name || !p.location?.name || !p.name || !p.id) return null;
      const citySlug = formatUrlStr(p.city.name);
      const zoneSlug = formatUrlStr(p.zone.name);
      const locationSlug = formatUrlStr(p.location.name);
      const projectSlug = createSlugStr(p.name);
      return {
        url: `${baseUrl}/properties/${citySlug}/${zoneSlug}/${locationSlug}/${projectSlug}-${p.id}`,
        lastModified: new Date(p.updatedAt || new Date()),
        changeFrequency: 'weekly',
        priority: 0.9,
      };
    }).filter(Boolean);
  }

  if (id === 'zones') {
    let projects = [];
    try {
      const { data } = await JUSTFLIP.get(`/project`, {
          params: { status: "active", approval: "approved", limit: 10000, page: 1 }
      });
      projects = data?.projects || [];
    } catch (e) {}

    const uniqueZones = new Set();
    const zoneRoutes = [];
    projects.forEach(p => {
      if (p.city?.name && p.zone?.name && p.zone?.id) {
        const citySlug = formatUrlStr(p.city.name);
        const zoneSlug = createSlugStr(p.zone.name);
        const key = `${citySlug}/${zoneSlug}-${p.zone.id}`;
        if (!uniqueZones.has(key)) {
          uniqueZones.add(key);
          zoneRoutes.push({
            url: `${baseUrl}/properties/${key}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        }
      }
    });
    return zoneRoutes;
  }

  if (id === 'localities') {
    let projects = [];
    try {
      const { data } = await JUSTFLIP.get(`/project`, {
          params: { status: "active", approval: "approved", limit: 10000, page: 1 }
      });
      projects = data?.projects || [];
    } catch (e) {}

    const uniqueLocalities = new Set();
    const localityRoutes = [];
    projects.forEach(p => {
      if (p.city?.name && p.zone?.name && p.location?.name && p.location?.id) {
        const citySlug = formatUrlStr(p.city.name);
        const zoneSlug = formatUrlStr(p.zone.name);
        const locSlug = createSlugStr(p.location.name);
        const key = `${citySlug}/${zoneSlug}/${locSlug}-${p.location.id}`;
        if (!uniqueLocalities.has(key)) {
          uniqueLocalities.add(key);
          localityRoutes.push({
            url: `${baseUrl}/properties/${key}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
          });
        }
      }
    });
    return localityRoutes;
  }

  if (id === 'blogs') {
    let blogs = [];
    try {
      const { data } = await JUSTFLIP.get(`/blog`, {
          params: { status: "active", approval: "approved", limit: 5000, page: 1 }
      });
      blogs = data?.blogs || [];
    } catch (e) {}

    return blogs.map(b => {
      if (!b.title || !b.id) return null;
      const slug = createSlugStr(b.title);
      return {
        url: `${baseUrl}/blogs/${slug}-${b.id}`,
        lastModified: new Date(b.updatedAt || new Date()),
        changeFrequency: 'weekly',
        priority: 0.7,
      };
    }).filter(Boolean);
  }

  if (id === 'developers') {
    let developers = [];
    try {
      const { data } = await JUSTFLIP.get(`/builder`, {
          params: { status: "active", approval: "approved", limit: 5000, page: 1 }
      });
      developers = data?.builders || data?.data || data || [];
    } catch (e) {}

    return developers.map(d => {
      if (!d.name || !d.id) return null;
      const slug = createSlugStr(d.name);
      return {
        url: `${baseUrl}/developers/${slug}-${d.id}`,
        lastModified: new Date(d.updatedAt || new Date()),
        changeFrequency: 'weekly',
        priority: 0.7,
      };
    }).filter(Boolean);
  }

  return [];
}

import { Project } from "../../types";

export function transformSearchResponse(raw: Record<string, any>, limit: number = 10): {
  results: Project[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
  facets: any;
} {
  const total = raw?.total || raw?.projects?.length || 0;
  const page = raw?.page || 1;
  const totalPages = raw?.totalPages || Math.ceil(total / limit) || 1;

  return {
    results: (raw?.projects || []).map(transformProject),
    total,
    page,
    totalPages,
    hasMore: raw?.hasMore ?? (page < totalPages),
    facets: raw?.facets || null,  // Future: Elasticsearch facets
  };
}

function transformProject(p: Record<string, any>): Project {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    type: p.type,
    description: p.description,
    summary: p.summary,
    city: p.city,
    zone: p.zone || p.location?.zone,
    location: p.location,
    minPrice: p.minPrice,
    maxPrice: p.maxPrice,
    units: p.units,
    medias: p.medias,
    banner: p.banner || p.medias?.find((m: any) => m.title === 'banner'),
    transactionTag: p.transactionTag,
    possessionStatus: p.possessionStatus,
    builder: p.builder,
    approval: p.approval,
    createdAt: p.createdAt,
    coordinates: p.coordinates || p.locationData,
  } as Project;
}

export function transformSuggestions(raw: Record<string, any>): {
  projects: any[];
  locations: any[];
  builders: any[];
} {
  return {
    projects: (raw?.projects || []).map((p: any) => ({
      id: p.id, name: p.name, type: 'project',
      city: p.city, zone: p.zone, location: p.location,
    })),
    locations: (raw?.locations || []).map((l: any) => ({
      id: l.id, name: l.name, type: 'location', city: l.city,
    })),
    builders: (raw?.builders || []).map((b: any) => ({
      id: b.id, name: b.name, type: 'builder',
    })),
  };
}

export function transformSearchResponse(raw) {
  return {
    results: (raw?.projects || []).map(transformProject),
    total: raw?.total || raw?.projects?.length || 0,
    page: raw?.page || 1,
    totalPages: raw?.totalPages || 1,
    hasMore: raw?.hasMore ?? (raw?.page < raw?.totalPages),
    facets: raw?.facets || null,  // Future: Elasticsearch facets
  };
}

function transformProject(p) {
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
    banner: p.banner || p.medias?.find(m => m.title === 'banner'),
    transactionTag: p.transactionTag,
    possessionStatus: p.possessionStatus,
    builder: p.builder,
    approval: p.approval,
    createdAt: p.createdAt,
  };
}

export function transformSuggestions(raw) {
  return {
    projects: (raw?.projects || []).map(p => ({
      id: p.id, name: p.name, type: 'project',
      city: p.city, zone: p.zone, location: p.location,
    })),
    locations: (raw?.locations || []).map(l => ({
      id: l.id, name: l.name, type: 'location', city: l.city,
    })),
    builders: (raw?.builders || []).map(b => ({
      id: b.id, name: b.name, type: 'builder',
    })),
  };
}

import { JUSTFLIP } from '@/src/lib/axios/api';
import { SearchAdapter } from '../SearchAdapter';
import { transformSearchResponse, transformSuggestions } from '../SearchTransformer';

export class PortalSearchAdapter extends SearchAdapter {
  constructor() {
    super();
    this.controller = null;
  }

  async search({ query, filters, sort, page, limit }) {
    this.abort(); // Cancel previous request
    this.controller = new AbortController();

    const params = {
      search: query || undefined,
      page,
      limit,
      ...this._mapFiltersToParams(filters),
      ...this._mapSortToParams(sort),
    };

    // Remove undefined values
    Object.keys(params).forEach(k => params[k] === undefined && delete params[k]);

    const { data } = await JUSTFLIP.get('/project', {
      params,
      signal: this.controller.signal,
    });

    return transformSearchResponse(data);
  }

  async suggest(query) {
    const { data } = await JUSTFLIP.get(`/project/search?query=${query}`);
    return transformSuggestions(data);
  }

  async trending() {
    // Stub — return popular searches from localStorage or API
    return [];
  }

  abort() {
    this.controller?.abort();
  }

  _mapFiltersToParams(filters = {}) {
    const params = {};
    if (filters.propertyType) params.propertyType = filters.propertyType;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.uploader) params.uploader = filters.uploader;
    if (filters.furnishing) params.furnishing = filters.furnishing;
    if (filters.approval) params.approval = filters.approval;
    if (filters.bhk) params.unitType = `${filters.bhk} BHK`;
    if (filters.facing) params.facing = filters.facing;
    return params;
  }

  _mapSortToParams(sort) {
    if (!sort || sort === 'relevance') return {};
    const map = {
      price_asc: { sort: 'price_asc' },
      price_desc: { sort: 'price_desc' },
      newest: { sort: 'createdAt_desc' },
      popular: { sort: 'createdAt_desc' }, // Fallback since backend doesn't have popular yet
    };
    return map[sort] || {};
  }
}

import { JUSTFLIP } from '@/src/lib/axios/api';
import { useCityStore } from '@/src/stores/city.store';
import { SearchAdapter } from '../SearchAdapter';
import { transformSearchResponse, transformSuggestions } from '../SearchTransformer';

export class PortalSearchAdapter extends SearchAdapter {
  private controller: AbortController | null = null;

  constructor() {
    super();
  }

  async search({ query, filters, sort, page, limit }: { query?: string; filters?: Record<string, any>; sort?: string; page?: number; limit?: number }): Promise<any> {
    this.abort(); // Cancel previous request
    this.controller = new AbortController();

    const activeCity = useCityStore.getState().activeCity;
    const cityId = filters?.cityId || (!filters?.zoneId && !filters?.locationId ? activeCity?.id : undefined);

    const params: Record<string, any> = {
      search: query || undefined,
      cityId: cityId || undefined,
      zoneId: filters?.zoneId || undefined,
      locationId: filters?.locationId || undefined,
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

    return transformSearchResponse(data, limit || 10);
  }

  async suggest(query: string): Promise<any> {
    const { data } = await JUSTFLIP.get(`/project/search?query=${query}`);
    return transformSuggestions(data);
  }

  async trending(): Promise<any[]> {
    // Stub — return popular searches from localStorage or API
    return [];
  }

  abort(): void {
    this.controller?.abort();
  }

  private _mapFiltersToParams(filters: Record<string, any> = {}): Record<string, any> {
    const params: Record<string, any> = {};
    if (filters.propertyType) params.propertyType = filters.propertyType;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.uploader) params.uploader = filters.uploader;
    if (filters.furnishing) params.furnishing = filters.furnishing;
    if (filters.approval) params.approval = filters.approval;

    // Unit Type / BHK mapping (supports comma-separated '1.5BHK,2.5BHK', arrays, or numeric bhk)
    if (filters.unitType) {
      if (Array.isArray(filters.unitType)) {
        params.unitType = filters.unitType.join(',');
      } else {
        params.unitType = String(filters.unitType);
      }
    } else if (filters.bhk) {
      const bhkStr = String(filters.bhk).trim();
      params.unitType = bhkStr.toUpperCase().endsWith('BHK') ? bhkStr.toUpperCase() : `${bhkStr}BHK`;
    }

    if (filters.facing) params.facing = filters.facing;
    if (filters.tag) params.tag = filters.tag;
    return params;
  }

  private _mapSortToParams(sort?: string): Record<string, any> {
    if (!sort || sort === 'relevance') return {};
    const map: Record<string, Record<string, string>> = {
      price_asc: { sort: 'price_asc' },
      price_desc: { sort: 'price_desc' },
      newest: { sort: 'createdAt_desc' },
      popular: { sort: 'createdAt_desc' }, // Fallback since backend doesn't have popular yet
    };
    return map[sort] || {};
  }
}

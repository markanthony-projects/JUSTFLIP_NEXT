import SearchPageClient from '../components/Search/SearchPageClient';
import { constructMetadata } from '@/src/utils/seo';

export async function generateMetadata({ searchParams }) {
  const p = await searchParams;
  const q = p?.q || '';
  return constructMetadata({
    title: q ? `Search Results for "${q}" Properties - Buy Flats & Villas | JustFlip` : 'Search Flats, Villas & Plots for Sale | JustFlip',
    description: q ? `Browse top real estate properties matching "${q}". View verified listings with photos, floor plans, and latest prices on JustFlip.` : 'Search for your dream home across India & Dubai. Browse 500+ verified apartments, villas, and plots with detailed pricing and photos.',
    canonical: `/search`,
    noIndex: true,
  });
}

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  
  // Server-side initial fetch for SEO and faster FCP
  // Pass serializable params to client component
  return (
    <SearchPageClient initialSearchParams={params} />
  );
}

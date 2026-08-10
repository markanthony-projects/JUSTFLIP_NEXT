import SearchPageClient from '../components/Search/SearchPageClient';
import { constructMetadata } from '@/src/utils/seo';
import { Metadata } from 'next';

type SearchProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: SearchProps): Promise<Metadata> {
  const p = await searchParams;
  const q = typeof p?.q === 'string' ? p.q : '';
  return constructMetadata({
    title: q ? `Search Results for "${q}" Properties - Buy Flats & Villas | JustFlip` : 'Search Flats, Villas & Plots for Sale | JustFlip',
    description: q ? `Browse top real estate properties matching "${q}". View verified listings with photos, floor plans, and latest prices on JustFlip.` : 'Search for your dream home across India & Dubai. Browse 500+ verified apartments, villas, and plots with detailed pricing and photos.',
    canonical: `/search`,
    noIndex: true,
  });
}

export const revalidate = 1800;

export default async function SearchPage({ searchParams }: SearchProps) {
  const params = await searchParams;
  
  // Server-side initial fetch for SEO and faster FCP
  // Pass serializable params to client component
  return (
    <div>
      <SearchPageClient initialSearchParams={params} initialSeoFilters={undefined} />
    </div>
  );
  
}

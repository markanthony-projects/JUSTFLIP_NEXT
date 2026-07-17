import SearchPageClient from '../components/Search/SearchPageClient';
import { constructMetadata } from '@/src/utils/seo';

export async function generateMetadata({ searchParams }) {
  const p = await searchParams;
  const q = p?.q || '';
  return constructMetadata({
    title: q ? `"${q}" Properties | Justflip` : 'Search Properties | Justflip',
    description: `Search real estate properties${q ? ` matching "${q}"` : ''} on Justflip.`,
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

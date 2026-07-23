import { notFound } from 'next/navigation';
import SearchPageClient from '../components/Search/SearchPageClient';
import { parseSlugToFilters } from '@/src/lib/seo/slugParser';
import { generateSeoMetadata } from '@/src/lib/seo/metadata';

// Generate dynamic metadata
export async function generateMetadata({ params }) {
  const p = await params;
  const slugArray = p?.slug || [];
  const filters = await parseSlugToFilters(slugArray);

  if (!filters) {
    return {
      title: 'Page Not Found | JustFlip',
    };
  }

  return generateSeoMetadata(filters, slugArray.join('/'));
}

// Render Page
export const revalidate = 1800;
export default async function DynamicSeoSearchPage({ params, searchParams }) {
  const p = await params;
  const s = await searchParams;
  
  const slugArray = p?.slug || [];
  const seoFilters = await parseSlugToFilters(slugArray);

  console.log('[DynamicSeoSearchPage] Incoming Slug:', slugArray.join('/'));
  console.log('[DynamicSeoSearchPage] Parsed SEO Filters:', seoFilters);

  // If the slug doesn't match our SEO patterns, trigger Next.js 404
  if (!seoFilters) {
    console.log('[DynamicSeoSearchPage] Invalid SEO Slug - Triggering 404 Not Found');
    notFound();
  }

  // We can pass both the parsed SEO filters and the URL searchParams 
  // (if any additional filters were applied on top of the SEO route)
  return (
    <SearchPageClient 
      initialSearchParams={s} 
      initialSeoFilters={seoFilters} 
    />
  );
}

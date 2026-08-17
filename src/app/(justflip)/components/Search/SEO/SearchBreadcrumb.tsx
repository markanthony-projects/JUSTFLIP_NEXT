import React from 'react';
import Link from 'next/link';
import { buildBreadcrumbSchema } from '@/src/utils/schema';

export default function SearchBreadcrumb({ query }: { query?: string }) {
  const items = [{ label: "Home", href: "/" }, { label: "Search Results" }];
  if (query) {
    items.push({ label: `"${query}"` });
  }
  const breadcrumbSchema = buildBreadcrumbSchema(items);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <nav aria-label="Breadcrumb" className="px-1 text-xs sm:text-sm">
        <ol className="flex items-center space-x-1.5 text-gray-500 flex-wrap">
          <li>
            <Link href="/" className="hover:text-[#002B5B] transition-colors">Home</Link>
          </li>
          <li>
            <span className="mx-2 text-gray-400">/</span>
          </li>
          <li>
            <span className="text-gray-900 font-medium">Search Results</span>
          </li>
          {query && (
            <>
              <li>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li>
                <span className="text-gray-900 font-medium truncate max-w-[200px] block">"{query}"</span>
              </li>
            </>
          )}
        </ol>
      </nav>
    </>
  );
}

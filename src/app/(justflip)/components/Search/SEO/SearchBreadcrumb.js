import React from 'react';
import Link from 'next/link';
import { buildBreadcrumbSchema } from '@/src/utils/schema';

export default function SearchBreadcrumb({ query }) {
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
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
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

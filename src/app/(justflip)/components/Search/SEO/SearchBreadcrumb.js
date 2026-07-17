import React from 'react';
import Link from 'next/link';

export default function SearchBreadcrumb({ query }) {
  return (
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
  );
}

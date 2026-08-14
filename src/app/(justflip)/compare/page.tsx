import { Suspense } from 'react';
import { fetchProjectById } from '@/src/services/ProjectService';
import CompareClientView from './CompareClientView';
import { Project } from '@/src/types';

import type { Metadata } from 'next';

export interface ComparePageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: ComparePageProps): Promise<Metadata> {
    // Await searchParams in Next.js 15+ (if applicable, but safe to do here)
    const params = await searchParams;
    const ids = params?.ids ? (params.ids as string).split(',').filter(Boolean) : [];
    
    if (ids.length === 0) {
        return {
            title: 'Compare Properties side-by-side | JustFlip',
            description: 'Compare multiple properties side-by-side. Compare prices, floor plans, amenities, and location advantages to find your perfect match on JustFlip.',
        };
    }

    return {
        title: `Comparing ${ids.length} Propert${ids.length > 1 ? 'ies' : 'y'} - Price, Amenities & Location | JustFlip`,
        description: `Compare ${ids.length} selected properties side-by-side. Analyze exact pricing, layouts, amenities, and connectivity to make an informed decision on JustFlip.`,
    };
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
    const params = await searchParams;
    const ids = params?.ids ? (params.ids as string).split(',').filter(Boolean) : [];
    
    // Fetch all properties in parallel
    const propertiesData = await Promise.all(
        ids.map(id => fetchProjectById(id))
    );

    // Filter out any null/undefined results if a fetch fails
    const validProperties = propertiesData.filter((p): p is Project => p !== null && p !== undefined);

    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
            <CompareClientView initialProperties={validProperties} />
        </Suspense>
    );
}
import { fetchProjectById } from '@/src/services/ProjectService';
import CompareClientView from './CompareClientView';
import { Project } from '@/src/types';

import type { Metadata } from 'next';
import ScrollToTop from '@/src/components/atoms/ScrollToTop';

export interface ComparePageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function extractProjectIds(params: { [key: string]: string | string[] | undefined }): string[] {
    const rawIds = params?.ids ? (params.ids as string).split(',') : [];
    const baseId = params?.baseId as string | undefined;
    const compareId = params?.compareId as string | undefined;

    const allIds = [
        ...rawIds,
        ...(baseId ? [baseId] : []),
        ...(compareId ? [compareId] : [])
    ].map(id => id.trim()).filter(Boolean);

    return Array.from(new Set(allIds));
}

export async function generateMetadata({ searchParams }: ComparePageProps): Promise<Metadata> {
    const params = await searchParams;
    const ids = extractProjectIds(params);
    
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
    const ids = extractProjectIds(params);
    
    const propertiesData = await Promise.all(
        ids.map(id => fetchProjectById(id))
    );

    const validProperties = propertiesData.filter((p): p is Project => p !== null && p !== undefined);

    return (
        <>
            <ScrollToTop />
            <CompareClientView initialProperties={validProperties} />
        </>
    );
}

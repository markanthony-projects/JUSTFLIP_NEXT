import { fetchProjectById } from '@/src/services/ProjectService';
import CompareClientView from './CompareClientView';

export async function generateMetadata({ searchParams }) {
    // Await searchParams in Next.js 15+ (if applicable, but safe to do here)
    const params = await searchParams;
    const ids = params?.ids ? params.ids.split(',').filter(Boolean) : [];
    
    if (ids.length === 0) {
        return {
            title: 'Compare Properties | JustFlip',
            description: 'Compare multiple properties side-by-side to find your perfect match on JustFlip.',
        };
    }

    return {
        title: `Comparing ${ids.length} Propert${ids.length > 1 ? 'ies' : 'y'} | JustFlip`,
        description: 'Compare your selected properties side-by-side to make an informed decision on JustFlip.',
    };
}

export default async function ComparePage({ searchParams }) {
    const params = await searchParams;
    const ids = params?.ids ? params.ids.split(',').filter(Boolean) : [];
    
    // Fetch all properties in parallel
    const propertiesData = await Promise.all(
        ids.map(id => fetchProjectById(id))
    );

    // Filter out any null/undefined results if a fetch fails
    const validProperties = propertiesData.filter(Boolean);

    return (
        <CompareClientView initialProperties={validProperties} />
    );
}
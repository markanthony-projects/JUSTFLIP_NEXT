"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Breadcrumb from '@/src/components/organisms/breadCrumb';
import { useCompareStore } from '@/src/stores/useCompare.store';
import { createProjectUrl } from '@/src/utils/url';
import CompareModal from './components/CompareModal';
import { FiShare2 } from 'react-icons/fi';
import { toast } from '@/src/utils/toast';

// Imported modular components
import CompareEmptyState from './components/CompareEmptyState';
import CompareFeaturesSidebar from './components/CompareFeaturesSidebar';
import ComparePropertyCard from './components/ComparePropertyCard';
import CompareAddCard from './components/CompareAddCard';

export default function CompareClientView({ initialProperties = [] }) {
    const { items: storeItems, remove: storeRemove } = useCompareStore();
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [isOpen, setIsOpen] = useState(false);
    const [isSyncing, setIsSyncing] = useState(true);
    const [expandedUnits, setExpandedUnits] = useState({});
    const [expandedAmenities, setExpandedAmenities] = useState({});

    const breadcrumbItems = [{ label: "Compare" }];
    const maxItems = 3;
    
    // Local state for instant UI updates when adding/removing
    const [currentProperties, setCurrentProperties] = useState(initialProperties);

    const [isHydrated, setIsHydrated] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const hasInitialSynced = useRef(false);

    // Rehydrate the Zustand store on mount so it has the correct state
    useEffect(() => {
        useCompareStore.persist.rehydrate();
        setIsHydrated(true);
    }, []);

    // Keep it synced if the server re-renders with new properties
    useEffect(() => {
        setCurrentProperties(initialProperties);
        setIsFetching(false);
    }, [initialProperties]);

    // Sync logic between Store and URL
    useEffect(() => {
        if (!isHydrated) return;

        const urlIds = searchParams.get('ids') || '';
        const storeIds = storeItems.map(item => item.id).join(',');

        if (!hasInitialSynced.current) {
            hasInitialSynced.current = true;
            // On first load, if URL has IDs and they differ from the store, URL wins (e.g. shared link)
            if (urlIds && urlIds !== storeIds) {
                if (initialProperties.length > 0) {
                    useCompareStore.setState({ items: initialProperties });
                    const timer = setTimeout(() => setIsSyncing(false), 50);
                    return () => clearTimeout(timer);
                } else {
                    router.replace('/compare');
                }
            }
        }

        // On subsequent runs (or if URL was empty on load), Store wins!
        if (urlIds !== storeIds) {
            if (currentProperties.length === 0 && storeIds) {
                setIsFetching(true);
            }
            if (storeIds) {
                router.replace(`/compare?ids=${storeIds}`);
            } else {
                router.replace('/compare');
            }
        }
        
        const timer = setTimeout(() => setIsSyncing(false), 50);
        return () => clearTimeout(timer);
    }, [searchParams, storeItems, initialProperties, router, isHydrated, currentProperties.length]);

    const handleProperty = (property) => {
        const projectUrl = createProjectUrl(
            property?.city?.name,
            property?.location?.name,
            property?.location?.name,
            property?.name,
            property?.id
        );
        router.push(projectUrl);
    };

    const handleRemove = (id) => {
        setCurrentProperties(prev => prev.filter(p => p.id !== id));
        storeRemove(id);
    };

    const showAddProject = currentProperties.length < maxItems;

    const handleShare = () => {
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(window.location.href)
                .then(() => toast.success("Link copied to clipboard!"))
                .catch(() => toast.error("Failed to copy link"));
        }
    };

    if (isSyncing || isFetching) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse w-8 h-8 rounded-full bg-[#002B5B]"></div>
            </div>
        );
    }

    return (
        <main className="min-h-screen font-sans pb-20">
            <Breadcrumb items={breadcrumbItems} />

            <div className='py-4 px-4 md:px-8 max-w-7xl mx-auto'>
                <header className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-[#002B5B] tracking-tight mb-2">
                            Compare Properties
                        </h1>
                        <p className="text-sm md:text-base text-gray-500">
                            Side-by-side comparison to help you make the right choice
                        </p>
                    </div>
                    {currentProperties.length > 0 && (
                        <button
                            onClick={handleShare}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-50 text-[#002B5B] hover:bg-blue-100 rounded-xl font-bold text-sm transition-all shadow-sm border border-blue-200 self-start md:self-auto"
                        >
                            <FiShare2 className="text-lg" />
                            Share Comparison
                        </button>
                    )}
                </header>

                {currentProperties.length === 0 ? (
                    <CompareEmptyState onAddClick={() => setIsOpen(true)} />
                ) : (
                    <section aria-label="Property Comparison Matrix" className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
                        
                        <CompareFeaturesSidebar />

                        {/* Property Cards Container */}
                        <div className="lg:col-span-10 flex overflow-x-auto snap-x snap-mandatory lg:grid lg:grid-cols-3 gap-6 pb-4 scrollbar-hidden [-webkit-overflow-scrolling:touch]">
                            {currentProperties.map((property, idx) => (
                                <ComparePropertyCard 
                                    key={property.id}
                                    property={property}
                                    idx={idx}
                                    expandedUnits={expandedUnits}
                                    setExpandedUnits={setExpandedUnits}
                                    expandedAmenities={expandedAmenities}
                                    setExpandedAmenities={setExpandedAmenities}
                                    handleRemove={handleRemove}
                                    handleProperty={handleProperty}
                                />
                            ))}

                            {showAddProject && (
                                <CompareAddCard onClick={() => setIsOpen(true)} />
                            )}
                        </div>
                    </section>
                )}
            </div>

            <CompareModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </main>
    );
}

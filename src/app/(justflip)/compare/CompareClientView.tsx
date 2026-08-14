"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Breadcrumb from '@/src/components/organisms/breadCrumb';
import { useCompareStore } from '@/src/stores/useCompare.store';
import { useAuthStore } from '@/src/stores/auth.store';
import { createProjectUrl } from '@/src/utils/url';
import CompareModal from './components/CompareModal';
import { FiShare2 } from 'react-icons/fi';
import { toast } from '@/src/utils/toast';

// Imported modular components
import CompareEmptyState from './components/CompareEmptyState';
import CompareFeaturesSidebar from './components/CompareFeaturesSidebar';
import ComparePropertyCard from './components/ComparePropertyCard';
import CompareAddCard from './components/CompareAddCard';

import { Project } from "@/src/types";

export interface CompareClientViewProps {
    initialProperties?: Project[];
}

export default function CompareClientView({ initialProperties = [] }: CompareClientViewProps) {
    const { items: storeItems, remove: storeRemove } = useCompareStore();
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [isOpen, setIsOpen] = useState(false);
    const [isSyncing, setIsSyncing] = useState(true);
    const [expandedUnits, setExpandedUnits] = useState({});
    const [expandedAmenities, setExpandedAmenities] = useState({});

    const breadcrumbItems = [{ label: "Compare" }];
    const maxItems = 3;
    
    const [currentProperties, setCurrentProperties] = useState(initialProperties.slice(0, maxItems));

    const [isHydrated, setIsHydrated] = useState(false);
    const [isAuthHydrated, setIsAuthHydrated] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const hasInitialSynced = useRef(false);

    // Rehydrate stores on mount
    useEffect(() => {
        useCompareStore.persist.rehydrate();
        setIsHydrated(true);

        // Check if auth store is hydrated
        if (useAuthStore.persist?.hasHydrated?.()) {
            setIsAuthHydrated(true);
        } else if (useAuthStore.persist?.onFinishHydration) {
            const unsub = useAuthStore.persist.onFinishHydration(() => {
                setIsAuthHydrated(true);
            });
            return () => unsub?.();
        } else {
            setIsAuthHydrated(true);
        }
    }, []);

    // Auth Protection Check
    useEffect(() => {
        if (isHydrated && isAuthHydrated && !isAuthenticated) {
            toast.error("Please login to compare properties");
            router.push('/login');
        }
    }, [isHydrated, isAuthHydrated, isAuthenticated, router]);

    useEffect(() => {
        setCurrentProperties(initialProperties.slice(0, maxItems));
        setIsFetching(false);
    }, [initialProperties]);

    useEffect(() => {
        if (!isHydrated) return;

        const idsParam = searchParams.get('ids');
        const baseId = searchParams.get('baseId');
        const compareId = searchParams.get('compareId');

        const parsedIds = idsParam 
            ? idsParam.split(',').filter(Boolean)
            : [baseId, compareId].filter(Boolean) as string[];

        const uniqueUrlIds = Array.from(new Set(parsedIds)).slice(0, maxItems);
        const urlIds = uniqueUrlIds.join(',');
        const storeIds = storeItems.slice(0, maxItems).map(item => item.id).join(',');

        if (!hasInitialSynced.current) {
            hasInitialSynced.current = true;
            if (urlIds && urlIds !== storeIds) {
                if (initialProperties.length > 0) {
                    useCompareStore.setState({ items: initialProperties.slice(0, maxItems) });
                    const timer = setTimeout(() => setIsSyncing(false), 50);
                    return () => clearTimeout(timer);
                } else {
                    router.replace('/compare');
                }
            }
        }

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

    const handleProperty = (property: Project) => {
        const projectUrl = createProjectUrl(
            property?.city?.name || "",
            property?.location?.name || "",
            property?.location?.name || "",
            property?.name || "",
            property?.id || ""
        );
        router.push(projectUrl);
    };

    const handleRemove = (id: string) => {
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

    if (isSyncing || isFetching || !isAuthHydrated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse w-8 h-8 rounded-full bg-[#002B5B]"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // Prevents UI flicker while redirecting
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

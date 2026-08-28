"use client";

import { useInfiniteScroll } from "@/src/hooks/useInfiniteScroll ";
import { useDeveloperStore } from "@/src/stores/builders.store";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiSearch, FiMapPin } from "react-icons/fi";
import DeveloperCard from "../../(justflip)/components/DeveloperCard";
import DeveloperCardSkeleton from "../../(justflip)/components/Skelton/DeveloperCardSkeleton";
import Pagination from "@/src/components/Pagination";
import { IoClose } from "react-icons/io5";
import { useCityStore } from "@/src/stores/city.store";
import CitySelectorModal from "@/src/components/NearestCity/CitySelectorModal";

export default function DevelopersClientPage({ initialData }: { initialData?: any }) {
    const { developers, fetchDevelopers, pagination, hasMore, isFetching, reset } = useDeveloperStore();
    const { cityList, activeCity } = useCityStore();
    const [search, setSearch] = useState("");
    const [selectedCityId, setSelectedCityId] = useState<string | number | null>(activeCity?.id || null);
    const [isCityModalOpen, setIsCityModalOpen] = useState(false);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (initialData) {
            const builders = initialData.builders || [];
            const total = initialData.total || 0;
            const limit = initialData.limit || 20;
            const totalPages = Math.ceil(total / limit);

            useDeveloperStore.setState({
                developers: builders,
                pagination: {
                    total,
                    limit,
                    page: 1,
                    totalPages,
                },
                hasMore: totalPages > 1,
                isFetching: false,
                loading: false,
            });
        }
    }, [initialData]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const delay = setTimeout(() => {
            reset();
            fetchDevelopers({ page: 1, search, cityId: selectedCityId });
        }, 1000);

        return () => clearTimeout(delay);
    }, [search, selectedCityId]);

    const loadMore = useCallback(() => {
        if (!hasMore || isFetching) return;

        fetchDevelopers({
            page: (pagination?.page || 1) + 1,
            search,
            cityId: selectedCityId
        });
    }, [pagination?.page, search, hasMore, isFetching, selectedCityId]);

    const sentinelRef = useInfiniteScroll({
        hasMore,
        loading: isFetching,
        onLoadMore: loadMore,
    });

    const handlePageChange = (newPage: number) => {
        if (!pagination) return;
        if (newPage < 1 || newPage > pagination.totalPages) return;

        reset();
        fetchDevelopers({ page: newPage, search, cityId: selectedCityId });
    };

    const handleLimitChange = (newLimit: number) => {
        reset();
        fetchDevelopers({ page: 1, limit: newLimit, search, cityId: selectedCityId });
    };


    return (
        <div className="flex flex-col min-h-screen pb-10">
            {/* Hero Section */}
            <div className="relative w-full rounded-2xl overflow-hidden mb-8 bg-gradient-to-br from-[#002B5B] to-[#00509E] text-white shadow-xl mt-4">
                {/* Decorative background pattern (optional) */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                
                <div className="relative z-10 px-6 py-16 md:py-20 flex flex-col items-center justify-center text-center">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
                        Discover Top Developers
                    </h1>
                    <p className="text-sm md:text-lg text-blue-100 max-w-2xl mb-10">
                        Explore premium builders and real estate projects across the top cities. Find the perfect developer for your next investment.
                    </p>

                    {/* Filter & Search Bar */}
                    <div className="w-full max-w-3xl flex flex-col md:flex-row items-center gap-2.5 bg-white p-2 rounded-2xl shadow-lg border border-gray-100">
                        {/* City Filter */}
                        <div 
                            className="relative w-full md:w-1/3 flex items-center bg-gray-50 hover:bg-gray-100 rounded-xl px-3 py-1 cursor-pointer transition-colors border border-gray-200"
                            onClick={() => setIsCityModalOpen(true)}
                        >
                            <FiMapPin className="text-gray-400 mr-2 shrink-0" />
                            <div className="w-full bg-transparent py-2.5 text-sm text-gray-700 outline-none flex items-center justify-between">
                                <span className={selectedCityId ? "text-gray-900 font-medium" : "text-gray-500"}>
                                    {selectedCityId ? cityList?.find(c => String(c.id) === String(selectedCityId))?.name || "All Cities" : "All Cities"}
                                </span>
                            </div>
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full md:w-2/3 flex items-center bg-gray-50 rounded-xl px-3 py-1 border border-gray-200 focus-within:border-[#002B5B] focus-within:bg-white transition-colors">
                            <FiSearch className="text-gray-400 mr-2 shrink-0" />
                            <input
                                type="text"
                                value={search}
                                placeholder="Search by developer name..."
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-transparent py-2.5 text-sm text-gray-700 outline-none"
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch("")}
                                    className="text-gray-400 hover:text-gray-600 ml-2"
                                >
                                    <IoClose size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 px-2 md:px-0">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {search || selectedCityId ? 'Search Results' : 'Featured Developers'}
                    </h2>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {pagination?.total || 0} Found
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start content-start">
                    {developers?.map((data) => (
                        <DeveloperCard key={data?.id} data={data} />
                    ))}

                    {isFetching &&
                        Array.from({ length: 8 }).map((_, i) => (
                            <DeveloperCardSkeleton key={i} />
                        ))}
                </div>

                {/* Infinite Scroll Sentinel (Mobile Only) */}
                <div ref={sentinelRef} className="h-10 w-full mt-4 md:hidden" />

                {/* Pagination Fallback */}
                <div className="hidden md:flex justify-center mt-8">
                    <Pagination
                        currentPage={pagination?.page || 1}
                        totalPages={pagination?.totalPages || 1}
                        totalItems={pagination?.total || 0}
                        limit={pagination?.limit || 10}
                        onPageChange={handlePageChange}
                        onLimitChange={handleLimitChange}
                    />
                </div>
            </div>

            <CitySelectorModal
                isOpen={isCityModalOpen}
                onClose={() => setIsCityModalOpen(false)}
                onCitySelect={(city) => setSelectedCityId(city?.id || null)}
                updateGlobalState={false}
                selectedCityIdOverride={selectedCityId}
            />
        </div>
    );
}
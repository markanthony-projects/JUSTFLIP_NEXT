"use client";

import { useInfiniteScroll } from "@/src/hooks/useInfiniteScroll ";
import { useDeveloperStore } from "@/src/stores/builders.store";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import DeveloperCard from "../../(justflip)/components/DeveloperCard";
import DeveloperCardSkeleton from "../../(justflip)/components/Skelton/DeveloperCardSkeleton";
import Pagination from "@/src/components/Pagination";
import { IoClose } from "react-icons/io5";
import Breadcrumb from "@/src/components/organisms/breadCrumb";

export default function DevelopersClientPage({ initialData }) {
    const { developers, fetchDevelopers, pagination, hasMore, isFetching, reset, } = useDeveloperStore();
    const [search, setSearch] = useState("");
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (initialData) {
            useDeveloperStore.setState({
                developers: initialData.data || [],
                pagination: initialData.pagination || {},
                hasMore: initialData.hasMore ?? true,
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
            fetchDevelopers({ page: 1, search });
        }, 400);

        return () => clearTimeout(delay);
    }, [search]);

    const loadMore = useCallback(() => {
        if (!hasMore || isFetching) return;

        fetchDevelopers({
            page: (pagination?.page || 1) + 1,
            search,
        });
    }, [pagination?.page, search, hasMore, isFetching]);

    const sentinelRef = useInfiniteScroll({
        hasMore,
        loading: isFetching,
        onLoadMore: loadMore,
    });

    const handlePageChange = (newPage) => {
        if (!pagination) return;
        if (newPage < 1 || newPage > pagination.totalPages) return;

        reset();
        fetchDevelopers({ page: newPage, search });
    };

    const handleLimitChange = (newLimit) => {
        reset();
        fetchDevelopers({ page: 1, limit: newLimit, search });
    };


    return (
        <div className="grid grid-cols-1 lg:grid-cols-4">
            <div className="h-screen lg:col-span-3 flex flex-col relative ">
                <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md md:px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                        <h1 className="text-lg font-semibold text-[#002B5B] tracking-tight">
                            Top Developers
                        </h1>
                        <p className="text-xs text-gray-500">
                            Discover premium builders & projects
                        </p>
                    </div>

                    <div className="relative w-full max-w-sm">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                        <input
                            type="text"
                            value={search}
                            placeholder="Search developers..."
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-10 pr-10 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition"
                        />

                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <IoClose size={18} />
                            </button>
                        )}
                    </div>
                </header>

                {/* GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto scrollbar-modern flex-1 px-1 py-2 items-start content-start">
                    {developers?.map((data) => (
                        <DeveloperCard key={data?.id} data={data} />
                    ))}

                    {isFetching &&
                        Array.from({ length: 8 }).map((_, i) => (
                            <DeveloperCardSkeleton key={i} />
                        ))}

                    <div ref={sentinelRef} />
                </div>

                <div className="hidden md:block">
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
        </div>

    );
}
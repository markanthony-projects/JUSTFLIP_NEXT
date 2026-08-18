"use client";

import React, { useEffect, useCallback, useMemo, useState } from "react";
import { useInfiniteScroll } from "@/src/hooks/useInfiniteScroll ";
import { useDeveloperStore } from "@/src/stores/builders.store";
import { TAB_MAPPING } from "./tabs";

import dynamic from "next/dynamic";
const MapView = dynamic(() => import("./MapView"), { ssr: false });
import TabsSection from "./TabsSection";
import ProjectList from "./ProjectList";
import { Builder } from "@/src/types";

export interface MapContainerProps {
    builder?: Builder;
}

function MapContainer({ builder }: MapContainerProps) {
    const [activeTab, setActiveTab] = useState("Upcoming");

    const { projects, fetchProjectByDeveloperId, page, hasMore, loading } = useDeveloperStore();

    useEffect(() => {
        if (!builder?.id) return;
        fetchProjectByDeveloperId({ id: builder.id, page: 1, tag: activeTab });
    }, [builder?.id, activeTab]);

    const handleLoadMore = useCallback(() => {
        if (!loading && hasMore && builder?.id) {
            fetchProjectByDeveloperId({
                id: builder.id,
                page: page + 1,
            });
        }
    }, [loading, hasMore, page, builder?.id]);

    const sentinelRef = useInfiniteScroll({
        hasMore,
        loading,
        onLoadMore: handleLoadMore,
    });

    const filteredProjects = useMemo(() => {
        return projects.filter(
            (p: any) => p.tags === TAB_MAPPING[activeTab as keyof typeof TAB_MAPPING]
        );
    }, [projects, activeTab]);

    return (
        <section className="w-full">
            {/* Map Wrapper */}
            <div className="rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100">
                <MapView projects={projects} />
            </div>

            <div ref={sentinelRef} />

            {/* Segmented Control Tabs */}
            <div className="mt-8 mb-6 overflow-x-auto scrollbar-hide px-4">
                <TabsSection
                    value={activeTab}
                    onChange={setActiveTab}
                    containerClass="w-full rounded-full bg-white border border-gray-200/60 p-1.5 shadow-[0_4px_20px_rgb(0,0,0,0.05)] max-w-2xl mx-auto"
                    indicatorClass="h-[calc(100%-12px)] top-[6px] bg-gradient-to-r from-[#002B5B] to-blue-800 rounded-full shadow-[0_4px_15px_rgba(0,43,91,0.2)]"
                    tabClass="text-gray-500 hover:text-[#002B5B] text-[13px] md:text-[15px] font-semibold transition-all duration-300 rounded-full"
                    activeTabClass="text-white hover:text-white"
                    height="h-10 md:h-12"
                />
            </div>

            {/* Projects List */}
            <ProjectList projects={filteredProjects} loading={loading} />
        </section>
    );
}

export default MapContainer;
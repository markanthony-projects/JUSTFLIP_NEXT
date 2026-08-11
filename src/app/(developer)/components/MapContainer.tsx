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
            <div className="mt-8 mb-6 overflow-x-auto scrollbar-hide">
                <TabsSection
                    value={activeTab}
                    onChange={setActiveTab}
                    containerClass="rounded-xl bg-gray-100/80 p-1.5 shadow-inner max-w-3xl mx-auto border border-gray-200"
                    indicatorClass="h-full bg-[#002B5B] rounded-lg shadow-md"
                    tabClass="text-gray-600 hover:text-[#002B5B] text-[13px] md:text-[15px] font-medium transition-colors"
                    activeTabClass="text-white hover:text-white font-bold"
                    height="h-10 md:h-12"
                />
            </div>

            {/* Projects List */}
            <ProjectList projects={filteredProjects} loading={loading} />
        </section>
    );
}

export default MapContainer;
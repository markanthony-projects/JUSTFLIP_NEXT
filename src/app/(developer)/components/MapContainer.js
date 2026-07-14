"use client";

import React, { useEffect, useCallback, useMemo, useState } from "react";
import { useInfiniteScroll } from "@/src/hooks/useInfiniteScroll ";
import { useDeveloperStore } from "@/src/stores/builders.store";
import { TAB_MAPPING } from "./tabs";

import dynamic from "next/dynamic";
const MapView = dynamic(() => import("./MapView"), { ssr: false });
import TabsSection from "./TabsSection";
import ProjectList from "./ProjectList";

function MapContainer({ builder }) {
    const [activeTab, setActiveTab] = useState("Upcoming");

    const { projects, fetchProjectByDeveloperId, page, hasMore, loading } = useDeveloperStore();

    useEffect(() => {
        if (!builder?.id) return;
        fetchProjectByDeveloperId({ id: builder.id, page: 1, tag: activeTab });
    }, [builder?.id, activeTab]);

    const handleLoadMore = useCallback(() => {
        if (!loading && hasMore) {
            fetchProjectByDeveloperId({
                id: builder?.id,
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
            (p) => p.tags === TAB_MAPPING[activeTab]
        );
    }, [projects, activeTab]);

    return (
        <section className="w-full p-4">
            <MapView projects={projects} />

            <div ref={sentinelRef} />

            <div className="border-1 rounded-lg mt-4 p-0.5 md:p-1 border-gray-700 overflow-x-auto scrollbar-hide ">
                <TabsSection
                    value={activeTab}
                    onChange={setActiveTab}
                    containerClass="rounded-md md:rounded-lg"
                    indicatorClass="h-full bg-[#002b5b] rounded-md md:rounded-lg shadow"
                    tabClass="text-black text-[10px] md:text-[14px]"
                    activeTabClass="text-white"
                    height="h-8 md:h-10"
                />
            </div>

            <ProjectList projects={filteredProjects} loading={loading} />
        </section>
    );
}

export default MapContainer;
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MdKeyboardDoubleArrowRight, MdReadMore } from "react-icons/md";

import { useCityStore } from "@/src/stores/city.store";
import * as ProjectService from "@/src/services/ProjectService";
import { City, Project } from "@/src/types";

import ProjectCarousel from "./ProjectCarousel";
import { PropertyCardSkeletonList } from "../Skelton/PropertyCardSkeleton";

export default function SSRProjectSection({ city, tag, projects: initialProjects }: { city?: City; tag: string; projects?: Project[] }) {

    const { activeCity } = useCityStore();

    const resolvedCity = activeCity || city;
    const resolvedCityId = resolvedCity?.id;

    const [projects, setProjects] = useState<Project[]>(initialProjects || []);
    const [loading, setLoading] = useState(false);
    const [fetchedCityId, setFetchedCityId] = useState<string | null>(city?.id || null);

    const cityText = useMemo(() => {
        return resolvedCity?.name ? `in ${resolvedCity.name}` : "";
    }, [resolvedCity?.name]);

    const title = useMemo(() => {
        return `New Launch Projects ${cityText}`;
    }, [cityText]);

    const subtitle = useMemo(() => {
        return `Latest residential projects with modern amenities and launch offers ${cityText}.`;
    }, [cityText]);

    useEffect(() => {

        if (!activeCity?.id || activeCity?.id === city?.id) return;

        let mounted = true;

        const fetchProjects = async () => {

            try {

                setLoading(true);

                const response = await ProjectService.fetchProjectsByTag({
                    cityId: activeCity?.id,
                    tag,
                    limit: 15
                });

                if (mounted) {
                    setProjects(response || []);
                    setFetchedCityId(activeCity?.id || null);
                }

            } catch (error) {

                console.error(error);

            } finally {

                if (mounted) {
                    setLoading(false);
                }

            }

        };

        fetchProjects();

        return () => {
            mounted = false;
        };

    }, [activeCity?.id, city?.id, tag]);

    const currentCityId = activeCity?.id || city?.id;
    const isDataForCurrentCity = fetchedCityId === currentCityId;

    if (isDataForCurrentCity && !loading && !projects.length) {
        return null;
    }

    return (
        <section>

            <div className="md:mb-2">

                <div className="flex items-center justify-between">

                    <h2 className="text-sm md:text-xl font-semibold text-[#002b5b]">
                        {title}
                    </h2>

                    <Link aria-label="View More" href={`/search?q=${resolvedCity?.name || ""}&tag=${tag || 'New Launches'}`} className="text-[#002B5B] flex items-center gap-1 items-center py-0.5 px-1 rounded-xs hover:bg-[#002B5B]/5 hover:underline transition-all duration-300 ease-in-out">
                        <span className="hidden sm:block text-xs font-semibold">View More</span>
                        <MdReadMore className="text-xl" />
                    </Link>

                </div>

                <p className="text-xs md:text-sm text-gray-600">
                    {subtitle}
                </p>

            </div>

            {loading || !projects.length ? (
                <PropertyCardSkeletonList />
            ) : (
                <ProjectCarousel projects={projects} />
            )}

        </section>
    );

}
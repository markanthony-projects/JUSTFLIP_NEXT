"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CgChevronRightO } from "react-icons/cg";

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
        if (!activeCity?.id) return;

        if (activeCity?.id === city?.id) {
            setProjects(initialProjects || []);
            setFetchedCityId(city?.id || null);
            return;
        }

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

    }, [activeCity?.id, city?.id, tag, initialProjects]);

    const currentCityId = activeCity?.id || city?.id;
    const isDataForCurrentCity = fetchedCityId === currentCityId;

    if (isDataForCurrentCity && !loading && !projects.length) {
        return null;
    }

    return (
        <section className="w-full flex flex-col">

            <div className="mb-0 md:mb-2">

                <div className="flex items-center justify-between">

                    <h2 className="section-heading">
                        {title}
                    </h2>

                    <Link aria-label="View More" href={`/search?q=${resolvedCity?.name || ""}&tag=${tag || 'NewLaunches'}`} className="text-primary flex items-center gap-1 items-center py-0.5 px-1 transition-all duration-300 hover:underline">
                        <span className="hidden sm:block text-lg font-semibold">View More</span>
                        <CgChevronRightO className="text-2xl" />
                    </Link>

                </div>

                <p className="hidden md:block text-xs md:text-sm text-gray-600">
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
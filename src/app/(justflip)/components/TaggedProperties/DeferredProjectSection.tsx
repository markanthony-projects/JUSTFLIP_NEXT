"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MdKeyboardDoubleArrowRight, MdReadMore } from "react-icons/md";

import dynamic from "next/dynamic";
import LazyHydrate from "@/src/components/LazyHydrate";
const ProjectCarousel = dynamic(() => import("./ProjectCarousel"), { ssr: false });
import { PropertyCardSkeletonList } from "../Skelton/PropertyCardSkeleton";

import { useCityStore } from "@/src/stores/city.store";
import * as ProjectService from "@/src/services/ProjectService";
import { City, Project } from "@/src/types";
import { FeaturedPropertySkeletonList } from "../Skelton/FeaturedPropertySkeleton";

export default function DeferredProjectSection({ city, tag }: { city?: City; tag: string }) {

    const { activeCity } = useCityStore();

    const resolvedCity = activeCity || city;
    const resolvedCityId = resolvedCity?.id;

    const [enabled, setEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [fetchedCityId, setFetchedCityId] = useState<string | null>(null);

    const cityText = useMemo(() => {
        return resolvedCity?.name ? `in ${resolvedCity.name}` : "";
    }, [resolvedCity?.name]);

    const content = useMemo(() => {

        switch (tag) {

            case "Upcoming Launches":
                return {
                    title: `Upcoming Residential Projects ${cityText}`,
                    subtitle: `Discover upcoming apartment and housing developments launching soon ${cityText}.`
                };

            case "Featured Properties":
                return {
                    title: `Featured Properties ${cityText}`,
                    subtitle: `Handpicked premium residential projects in prime locations ${cityText || "across India"}.`
                };

            default:
                return {
                    title: "",
                    subtitle: ""
                };

        }

    }, [tag, cityText]);

    const [prevCityId, setPrevCityId] = useState(resolvedCityId);

    useEffect(() => {
        if (prevCityId && prevCityId !== resolvedCityId) {
            setPrevCityId(resolvedCityId);
            setEnabled(false);
            setProjects([]);
            setLoading(false);
        }
    }, [resolvedCityId, prevCityId]);

    useEffect(() => {

        if (!enabled || !resolvedCityId) return;

        let mounted = true;

        const fetchProjects = async () => {

            try {

                setLoading(true);

                const response = await ProjectService.fetchProjectsByTag({
                    cityId: resolvedCityId,
                    tag,
                    limit: 15
                });

                if (mounted) {
                    setProjects(response || []);
                    setFetchedCityId(resolvedCityId);
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

    }, [enabled, resolvedCityId, tag]);

    const isDataForCurrentCity = fetchedCityId === resolvedCityId;

    if (enabled && isDataForCurrentCity && !loading && !projects.length) {
        return null;
    }

    return (
        <section className="w-full flex flex-col">

            <div className="mb-0 md:mb-2">

                <div className="flex items-center justify-between">

                    <h2 className="text-sm md:text-xl font-semibold text-[#002b5b]">
                        {content.title}
                    </h2>

                    <Link aria-label="View More" href={`/search?q=${resolvedCity?.name || ""}&tag=${tag || ""}`} className="text-[#002B5B] flex items-center gap-1 items-center py-0.5 px-1 rounded-xs hover:bg-[#002B5B]/5 hover:underline transition-all duration-300 ease-in-out">
                        <span className="hidden sm:block text-xs md:text-sm font-semibold">View More</span>
                        <MdReadMore className="text-xl" />
                    </Link>

                </div>

                <p className="hidden md:block text-xs md:text-sm text-gray-600">
                    {content.subtitle}
                </p>

            </div>

            <LazyHydrate
                key={`${resolvedCityId}-${tag}`}
                rootMargin="500px"
                placeholder={tag === "Featured Properties" ? <FeaturedPropertySkeletonList/> : <PropertyCardSkeletonList />}
                onVisible={() => setEnabled(true)}
            >

                {loading || !projects.length ? (
                    tag === "Featured Properties" ? <FeaturedPropertySkeletonList/> : <PropertyCardSkeletonList />
                ) : (
                    <ProjectCarousel projects={projects} 
                        varient = {tag === "Featured Properties" ? "featured" : tag === "Upcoming Launches" ? "upcoming" : "default"}
                    />
                )}

            </LazyHydrate>

        </section>
    );

}
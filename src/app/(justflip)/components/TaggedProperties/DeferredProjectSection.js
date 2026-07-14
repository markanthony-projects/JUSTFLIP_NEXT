"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MdKeyboardDoubleArrowRight, MdReadMore } from "react-icons/md";

import LazyHydrate from "@/src/components/LazyHydrate";
import ProjectCarousel from "./ProjectCarousel";
import { PropertyCardSkeletonList } from "../Skelton/PropertyCardSkeleton";

import { useCityStore } from "@/src/stores/city.store";
import * as ProjectService from "@/src/services/ProjectService";

export default function DeferredProjectSection({ city, tag }) {

    const { activeCity } = useCityStore();

    const resolvedCity = activeCity || city;
    const resolvedCityId = resolvedCity?.id;

    const [enabled, setEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);

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
                    subtitle: `Handpicked premium residential projects in prime locations across ${resolvedCity?.name}.`
                };

            default:
                return {
                    title: "",
                    subtitle: ""
                };

        }

    }, [tag, cityText, resolvedCity?.name]);

    useEffect(() => {
        setEnabled(false);
        setProjects([]);
        setLoading(false);
    }, [resolvedCityId, tag]);

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

    return (
        <section>

            <div className="mb-0 md:mb-2">

                <div className="flex items-center justify-between">

                    <h2 className="text-sm md:text-xl font-semibold text-[#002b5b]">
                        {content.title}
                    </h2>

                    <Link href="/projects?tag=New Launch" className="text-[#002B5B] flex items-center gap-1 items-center py-0.5 px-1 rounded-xs hover:bg-[#002B5B]/5 hover:underline transition-all duration-300 ease-in-out">
                        <span className="hidden sm:block text-xs font-semibold">View More</span>
                        <MdReadMore className="text-xl" />
                    </Link>

                </div>

                <p className="text-xs md:text-sm text-gray-600">
                    {content.subtitle}
                </p>

            </div>

            <LazyHydrate
                key={`${resolvedCityId}-${tag}`}
                rootMargin="500px"
                placeholder={<PropertyCardSkeletonList />}
                onVisible={() => setEnabled(true)}
            >

                {loading || !projects.length ? (
                    <PropertyCardSkeletonList />
                ) : (
                    <ProjectCarousel projects={projects} />
                )}

            </LazyHydrate>

        </section>
    );

}
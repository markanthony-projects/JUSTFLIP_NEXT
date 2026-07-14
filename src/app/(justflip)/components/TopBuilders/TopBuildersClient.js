"use client";

import Carousel from "@/src/components/Carousel";
import LazyHydrate from "@/src/components/LazyHydrate";
import Image from "@/src/components/atoms/Image";
import * as BuilderService from "@/src/services/BuilderService";
import { useCityStore } from "@/src/stores/city.store";
import { formatUrl } from "@/src/utils/URLFormatter";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MdKeyboardDoubleArrowRight, MdReadMore } from "react-icons/md";


function BuilderSkeleton() {
    function CardSkeleton() {
        return (
            <div className="w-70 rounded-lg flex items-center p-2 border border-gray-200 gap-4 animate-pulse">
                <div className="h-15 w-15 md:h-20 md:w-20 rounded-md bg-gray-200" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                </div>
            </div>
        )
    }

    return (
        <div
            className="grid grid-flow-col grid-rows-2 auto-cols-[280px] gap-4 overflow-hidden py-2">
            {Array.from({ length: 8 }).map((_, index) => (<CardSkeleton key={index} />))}
        </div>
    );
}

export default function TopBuildersClient({
    city,
    initialBuilders
}) {

    const { activeCity } = useCityStore();

    const resolvedCity = activeCity || city;
    const resolvedCityId = resolvedCity?.id;

    const [enabled, setEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [builders, setBuilders] = useState(initialBuilders || []);

    const cityText = useMemo(() => {
        return resolvedCity?.name || "";
    }, [resolvedCity?.name]);

    useEffect(() => {

        if (!activeCity?.id || activeCity?.id === city?.id) {
            return;
        }

        setEnabled(false);
        setBuilders([]);
        setLoading(false);

    }, [resolvedCityId, city?.id]);

    useEffect(() => {

        if (!enabled || !resolvedCityId) return;

        let mounted = true;

        const fetchBuilders = async () => {

            try {

                setLoading(true);

                const response =
                    await BuilderService.fetchTopBuilders({
                        cityId: resolvedCityId,
                        limit: 20
                    });

                if (mounted) {
                    setBuilders(response?.builders || []);
                }

            } catch (error) {

                console.error(error);

            } finally {

                if (mounted) {
                    setLoading(false);
                }

            }

        };

        fetchBuilders();

        return () => {
            mounted = false;
        };

    }, [enabled, resolvedCityId]);

    return (
        <section>

            <div className="md:mb-2">

                <div className="flex gap-2 items-center justify-between">

                    <h2 className="text-sm md:text-xl font-semibold text-[#002b5b]">
                        {`Top Real Estate Builders in ${cityText}`}
                    </h2>

                    <Link href="/developers" className="text-[#002B5B] flex items-center gap-1 items-center py-0.5 px-1 rounded-xs hover:bg-[#002B5B]/5 hover:underline transition-all duration-300 ease-in-out">
                        <span className="hidden sm:block text-xs font-semibold">View More</span>
                        <MdReadMore className="text-xl" />
                    </Link>

                </div>

                <p className="text-xs text-gray-600 max-w-2xl leading-relaxed">
                    {`Explore trusted builders delivering premium residential projects in ${cityText}.`}
                </p>

            </div>

            <LazyHydrate
                key={resolvedCityId}
                rootMargin="500px"
                placeholder={<BuilderSkeleton />}
                onVisible={() => setEnabled(true)}
            >

                {loading || !builders.length ? (

                    <BuilderSkeleton />

                ) : (

                    <Carousel
                        rows={2}
                        items={builders}
                        gap={16}
                        showDots={false}
                        showArrows
                        renderItem={(builder) => {

                            const logo = builder?.logo;
                            const projectsCount =
                                builder?.totalProjects ?? 0;

                            return (
                                <Link href={`/developers/${formatUrl(builder?.name)}-${builder?.id}`}>

                                    <div className="w-70 rounded-lg flex items-center p-2 border border-gray-200 hover:shadow-md transition gap-4">

                                        <div className="shadow h-15 w-15 md:h-20 md:w-20 overflow-hidden rounded-md relative">
                                            <Image
                                                src={logo}
                                                alt={`${builder?.name || "builder"} logo`}
                                                className="object-contain"
                                            // sizes="80px"
                                            />
                                        </div>

                                        <div>

                                            <h3 className="text-sm font-semibold md:font-bold line-clamp-2">
                                                {builder?.name}
                                            </h3>

                                            <p className="text-xs md:text-sm text-gray-500">
                                                {projectsCount} Properties
                                            </p>

                                        </div>

                                    </div>

                                </Link>
                            );

                        }}
                    />

                )}

            </LazyHydrate>

        </section>
    );

}
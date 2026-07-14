"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import LazyHydrate from "@/src/components/LazyHydrate";
import Carousel from "@/src/components/Carousel";
import PopularCityCard from "@/src/components/Cards/PopularCityCard";

import SiteService from "@/src/services/SiteService";

import Skeleton from "./Skeleton";

export default function PopularCitiesClient({
    initialCities,
    initialOffset,
    initialHasMore
}) {

    const [enabled, setEnabled] = useState(false);

    const [cities, setCities] = useState(initialCities || []);
    const [offset, setOffset] = useState(initialOffset || 0);
    const [hasMore, setHasMore] = useState(initialHasMore || false);

    const [loading, setLoading] = useState(false);

    const loadingRef = useRef(false);

    /*
    |--------------------------------------------------------------------------
    | Initial Lazy Fetch
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (!enabled || cities.length) return;

        let mounted = true;

        const fetchCities = async () => {

            try {

                setLoading(true);

                const data =
                    await SiteService.fetchPopularCities({
                        offset: 0
                    });

                if (!mounted) return;

                setCities(data?.cities || []);
                setOffset(data?.nextOffset || 0);
                setHasMore(data?.hasMore || false);

            } catch (error) {

                console.error(error);

            } finally {

                if (mounted) {
                    setLoading(false);
                }

            }

        };

        fetchCities();

        return () => {
            mounted = false;
        };

    }, [enabled, cities.length]);

    /*
    |--------------------------------------------------------------------------
    | Infinite Load
    |--------------------------------------------------------------------------
    */

    const loadMoreCities = async () => {

        if (
            !hasMore ||
            loadingRef.current
        ) return;

        loadingRef.current = true;

        try {

            const data =
                await SiteService.fetchPopularCities({
                    offset
                });

            setCities((prev) => [
                ...prev,
                ...(data?.cities || [])
            ]);

            setOffset(data?.nextOffset || 0);
            setHasMore(data?.hasMore || false);

        } catch (error) {

            console.error(error);

        } finally {

            loadingRef.current = false;

        }

    };

    return (
        <LazyHydrate
            rootMargin="500px"
            placeholder={<Skeleton />}
            onVisible={() => setEnabled(true)}
        >

            {loading || !cities.length ? (

                <Skeleton />

            ) : (

                <>
                    <Carousel
                        rows={2}
                        items={cities}
                        gap={16}
                        aspect="h-fit"
                        showDots={false}
                        showArrows
                        onReachEnd={loadMoreCities}
                        renderItem={(city, i) => (
                            <PopularCityCard
                                key={city?.id}
                                city={city}
                                priority={i < 3}
                            />
                        )}
                    />

                    {loadingRef.current && (
                        <div className="mt-4">
                            <Skeleton />
                        </div>
                    )}
                </>

            )}

        </LazyHydrate>
    );

}
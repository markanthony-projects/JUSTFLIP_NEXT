import { Suspense } from "react";
import BannerCarousel from "./Banner.client";
import BannerSkeleton from "./BannerSkeleton";
import JustflipService from "@/src/services/JustflipService";

async function getBanners() {
    const banners = await JustflipService.fetchBanners();
    return banners;
}

export default async function FeaturedServer() {
    const banners = await getBanners();
    if (!banners.length) return null;

    return (
        <section className="relative w-full h-[300px] md:h-[350px] lg:h-[400px] overflow-hidden">

            {/* 🔥 Preload first image */}
            <link
                rel="preload"
                as="image"
                href={banners[0].url}
                fetchpriority="high"
            />

            <Suspense fallback={<BannerSkeleton />}>
                <BannerCarousel banners={banners} />
            </Suspense>
        </section>
    );
}

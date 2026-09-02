import React, { Suspense } from 'react'
import { notFound } from 'next/navigation';
import { getProjectPageData, getProjectReviews, getLocationDetails, getSimilarProjects } from '@/src/app/(justflip)/components/CityComponent/city.server';
import dynamic from 'next/dynamic';
import Breadcrumb from '@/src/components/organisms/breadCrumb';
import PriceTrendSchema from '@/src/components/seo/PriceTrendSchema';
import { createCityUrl, createLocationUrl, createZoneUrl, parseProjectUrl } from '@/src/utils/url';
import HighlightProjectSkeleton from '@/src/app/(justflip)/components/Project/HighlightProjectSkeleton';
import CallbackFormSkeleton from '@/src/app/(justflip)/components/Skelton/CallbackFormSkeleton';
import CompareCarouselSkeleton from '@/src/app/(justflip)/components/Skelton/CompareCarouselSkeleton';
import DescriptionSkeleton from '@/src/app/(justflip)/components/Skelton/DescriptionSkeleton';
import DeveloperLegacySkeleton from '@/src/app/(justflip)/components/Skelton/DeveloperDetailsSkeleton';
import ExploreMapSkeleton from '@/src/app/(justflip)/components/Skelton/ExploreMapSkeleton';
import { FAQSkeleton } from '@/src/app/(justflip)/components/Skelton/FAQSkeleton';
import FeaturesSkeleton from '@/src/app/(justflip)/components/Skelton/FeaturesSkeleton';
import FloatingActionsSkeleton from '@/src/app/(justflip)/components/Skelton/FloatingActionsSkeleton';
import { HighlightSkeleton } from '@/src/app/(justflip)/components/Skelton/HighlightSkeleton';
import ImageBannerSkeleton from '@/src/app/(justflip)/components/Skelton/ImageBannerSkeleton';
import LocationImageGallerySkeleton from '@/src/app/(justflip)/components/Skelton/LocationImageGallerySkeleton';
import PriceTrendSkeleton from '@/src/app/(justflip)/components/Skelton/PriceTrendSkeleton';
import ProjectOverviewSkeleton from '@/src/app/(justflip)/components/Skelton/ProjectOverviewSkeleton';
import PropertyHeaderSkeleton from '@/src/app/(justflip)/components/Skelton/PropertyHeaderSkeleton';
import { ReviewsSkeleton } from '@/src/app/(justflip)/components/Skelton/ReviewsSkeleton';
import SimilarPropertiesSkeleton from '@/src/app/(justflip)/components/Skelton/SimilarPropertiesSkeleton';
import UnitTableSkeleton from '@/src/app/(justflip)/components/Skelton/UnitTableSkeleton';
import bcd from "@/public/banners/bcd.webp"

const Description = dynamic(() => import('@/src/app/(justflip)/components/Project/Description'));
const ImageBanner = dynamic(() => import('@/src/app/(justflip)/components/Project/ImageBanner'));
const PropertyHeader = dynamic(() => import('@/src/app/(justflip)/components/Project/PropertyHeader'));
const ProjectOverview = dynamic(() => import('@/src/app/(justflip)/components/Project/ProjectOverview'));
const UnitTable = dynamic(() => import('@/src/app/(justflip)/components/Project/UnitTable'));
const Features = dynamic(() => import('@/src/app/(justflip)/components/Project/Feature'));
const ExploreMap = dynamic(() => import('@/src/app/(justflip)/components/Project/ExploreMap'));
const HighlightsProject = dynamic(() => import('@/src/app/(justflip)/components/Project/HighlightsProject'));
const ReviewsSectionClient = dynamic(() => import('@/src/app/(justflip)/components/CityComponent/ReviewsSectionClient'));
const DeveloperDetail = dynamic(() => import('@/src/app/(justflip)/components/Project/DeveloperDetail'));
const Highlight = dynamic(() => import('@/src/app/(justflip)/components/Highlight'));
const PriceTrendSection = dynamic(() => import('@/src/components/trendGraph/PriceTrendSection'));
const PropertyGallery = dynamic(() => import('@/src/app/(justflip)/components/PropertyGallery'));
const LeadForm = dynamic(() => import('@/src/components/molecules/LeadForm'));
const CompareCarousel = dynamic(() => import('@/src/app/(justflip)/components/Project/CompareProject'));
const SimilarProject = dynamic(() => import('@/src/app/(justflip)/components/Project/SimilarProject'));
const FAQ = dynamic(() => import('@/src/app/(justflip)/components/FAQ'));
const SocialMedia = dynamic(() => import('@/src/app/(justflip)/components/Project/socialMedia'));

import { constructMetadata } from "@/src/utils/seo";
import { buildRealEstateSchema } from "@/src/utils/schema";
import ScrollToTop from '@/src/components/atoms/ScrollToTop';
import Link from 'next/link';
import Image from 'next/image';
import QuickCalculations from '@/src/app/(justflip)/components/Project/QuickCalculations';
import PropertyDetailNavTabs from '@/src/app/(justflip)/components/PropertyDetailsNavTabs';

const propertyNavItems = [
  { id: "overview", label: "About the Project" },
  { id: "floor-plans", label: "Floor Plans" },
  { id: "amenities", label: "Amenities & Specifications" },
  { id: "tools", label: "Financial & Tax Estimator"},
  { id: "location", label: "Location & Connectivity"},
  { id: "highlights", label: "Highlights" },
  { id: "reviews", label: "Reviews" },
  { id: "developer", label: "Developer Legacy" },
  { id: "price-trend", label: "Price Trend" },
  { id: "gallery", label: "Gallery" },
  { id: "similar-properties", label: "Similar Properties" },
  { id: "faq", label: "FAQ" },
];

const FloatingActions = dynamic(() => import('@/src/app/(justflip)/components/Project/FloatingActions'));

type ProjectPageProps = {
    params: Promise<{ city: string; zone: string; location: string; slug: string }>;
};
export async function generateMetadata({ params }: ProjectPageProps) {
    const { city, zone, location, slug } = await params;
    const { cityName, locationName, name } = parseProjectUrl(city, zone, location, slug);

    const title = `${name || 'Property'} in ${locationName || cityName}, ${cityName} - Price, Floor Plans, Reviews`;
    const description = `Explore ${name || 'Property'} located in ${locationName || cityName}, ${cityName}. View exact pricing, 2/3/4 BHK floor plans, amenities, photos, and read verified reviews on JustFlip.`;
    const url = `/properties/${city}/${zone}/${location}/${slug}`;

    return constructMetadata({
        title,
        description,
        canonical: url,
        image: 'https://justflip.in/logo.png'
    });
}

export const revalidate = 1800;

async function PropertyDetails({ params }: ProjectPageProps) {
    const { city, zone, location, slug } = await params;
    const { cityName, zoneName, locationName, name, id } = parseProjectUrl(city, zone, location, slug)
    
    // TEMPORARY ARTIFICIAL DELAY: Sleeps for 10 seconds to allow you to inspect the loading skeleton
    // await new Promise(resolve => setTimeout(resolve, 10000));
    
    const [data, reviewData] = await Promise.all([
        getProjectPageData(id),
        getProjectReviews(id)
    ]);

    if (!data || !data.projectData) {
        return notFound();
    }

    const { projectData } = data;


    const locationId = projectData?.location?.id;
    const cityUrl = createCityUrl(cityName, projectData?.city?.id || "")
    const zoneUrl = createZoneUrl(cityName, projectData?.zone?.name || "", projectData?.zone?.id || "")
    const locationUrl = createLocationUrl(cityName, zoneName, locationName, projectData?.location?.id || "")

    const breadcrumbItems = [
        { label: "Properties", href: "/properties" },
        { label: cityName || "City Details", href: `${cityUrl}` },
        { label: zoneName || "Zone Details", href: `${zoneUrl}` },
        { label: locationName || "Location Details", href: `${locationUrl}` },
        { label: name }
    ];

    const ratingValue = reviewData?.global?.average ?? projectData?.avgRating ?? projectData?.rating;
    const reviewCount = reviewData?.global?.pagination?.totalReviews ?? reviewData?.global?.reviews?.length ?? projectData?.reviewCount;
    const propertyImages = Array.from(new Set([
        projectData?.displayImage,
        projectData?.banner?.url,
        ...(projectData?.medias || []).map((m: any) => m?.url)
    ])).filter(Boolean) as string[];

    const realEstateSchema = buildRealEstateSchema({
        name: projectData?.name || name,
        description: projectData?.description,
        url: `/properties/${city}/${zone}/${location}/${slug}`,
        locationName,
        cityName,
        minPrice: projectData?.minPrice,
        maxPrice: projectData?.maxPrice,
        price: projectData?.minPrice,
        priceCurrency: "INR",
        reraNumber: projectData?.rera || projectData?.reraNumber,
        amenities: projectData?.amenities,
        latitude: projectData?.latitude || projectData?.location?.latitude,
        longitude: projectData?.longitude || projectData?.location?.longitude,
        images: propertyImages,
        ratingValue,
        reviewCount,
        availability: projectData?.status === 'ready' || projectData?.status === 'active' ? 'InStock' : 'PreOrder'
    });

    const staticAddSection = {
        src: bcd,
        alt: 'GOLF-LINK BCD',
        href: 'https://justflip.in/bengaluru/east/hoskote/bcd-codename-golf-links/5ac3a691-3c70-4354-863e-10a3f4108c64'
    }

    return (
        <>
            <div className='w-full max-w-full overflow-x-hidden px-2 md:px-4 !bg-[#F1F1F]'>
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(realEstateSchema) }} />
                <ScrollToTop />

                <Breadcrumb items={breadcrumbItems} />

                <Description project={projectData} />

                <PropertyDetailNavTabs navItems={propertyNavItems}/>

                {/* <ImageBanner project={projectData} /> */}

                {/* <Suspense fallback={<PropertyHeaderSkeleton />} >
                    <PropertyHeader project={projectData} />
                </Suspense>

                <div className='hidden lg:block'>
                    <Suspense fallback={<FloatingActionsSkeleton />} >
                        <SocialMedia />
                    </Suspense>
                </div> */}

                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-6 xl:grid-cols-7 gap-4 lg:gap-6">
                    {/* Left Column: Stack of individual, clean tile cards */}
                    <div className="lg:col-span-4 xl:col-span-5 space-y-4 md:space-y-6">
                        
                        {/* 1. Project Overview */}
                        <div id="overview" className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
                            <Suspense fallback={<ProjectOverviewSkeleton />}>
                                <ProjectOverview project={projectData} />
                            </Suspense>
                        </div>

                        {/* 2. Floor Plans / Unit Table */}
                        {projectData?.units && projectData.units.length > 0 && (
                            <div id="floor-plans" className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
                                <Suspense fallback={<UnitTableSkeleton />}>
                                    <UnitTable project={projectData} />
                                </Suspense>
                            </div>
                        )}

                        {/* 3. Features & Amenities */}
                        {projectData?.amenities && projectData.amenities.length > 0 && (
                            <div id="amenities" className="!bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
                                <Suspense fallback={<FeaturesSkeleton />}>
                                    <Features project={projectData} />
                                </Suspense>
                            </div>
                        )}

                        <div id="tools">
                            <QuickCalculations project={projectData}/>
                        </div>

                        {/* 4. Explore Map / Transit / Essentials */}
                        <div id="location" className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
                            <Suspense fallback={<ExploreMapSkeleton />}>
                                <ExploreMap project={projectData} />
                            </Suspense>
                        </div>

                        {/* 5. Project Highlights */}
                        {projectData?.advantages && projectData.advantages.length > 0 && (
                            <div id="highlights" className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
                                <Suspense fallback={<HighlightProjectSkeleton />}>
                                    <HighlightsProject project={projectData} />
                                </Suspense>
                            </div>
                        )}

                        {/* 6. Ratings & Reviews */}
                        <div id="reviews" className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
                            <Suspense fallback={<ReviewsSkeleton />}>
                                <ReviewsWrapper projectId={id} projectName={projectData?.name} />
                            </Suspense>
                        </div>

                        {/* 7. Location Info (Developer Legacy, Locality Insights, Price Trends, Gallery) */}
                        <Suspense fallback={
                            <div className="space-y-4 md:space-y-6">
                                <DeveloperLegacySkeleton />
                                <HighlightSkeleton />
                                <PriceTrendSkeleton />
                                <LocationImageGallerySkeleton />
                            </div>
                        }>
                            <LocationInfoWrapper locationId={locationId} projectData={projectData} />
                        </Suspense>

                    </div>

                    <div className="hidden lg:block lg:col-span-2 xl:col-span-2">
                        <Link
                            href={staticAddSection.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full relative hidden lg:block mb-4 overflow-hidden rounded-sm group"
                        >
                            <Image
                                src={staticAddSection.src}
                                alt={staticAddSection.alt}
                                width={1200} 
                                height={400}
                                sizes="(min-width: 1024px) 100vw, 0vw"
                                className="w-full h-auto object-cover rounded-sm"
                                priority={false}
                            />
                            <span className="px-2 py-0.5 bg-black/25 text-xs absolute top-2 left-2 text-white/50 rounded-sm pointer-events-none">
                                AD
                            </span>
                        </Link>
                        <div className="lg:mt-0 hidden md:flex md:flex-col gap-4">
                            <Suspense fallback={<CallbackFormSkeleton />}>
                                <LeadForm data={projectData} />
                            </Suspense>
                        </div>
                    </div>
                </div>

                <section className="lg:hidden block">
                    <FloatingActions data={projectData} />
                </section>
                <Suspense fallback={<SimilarPropertiesSkeleton />}>
                    <div id="similar-properties">
                    <SimilarProjectsWrapper locationId={locationId} projectId={id} type="similar" />
                    </div>
                </Suspense>
                <Suspense fallback={<FAQSkeleton />}>
                    <div id="faq">
                        <FAQ data={projectData} />
                    </div>
                </Suspense>

            </div>
        </>
    )
}

async function ReviewsWrapper({ projectId, projectName }: { projectId: string, projectName: string }) {
    const reviewData = await getProjectReviews(projectId);
    return <ReviewsSectionClient typeName={projectName} typeId={projectId} type="project" reviews={reviewData} />;
}

async function LocationInfoWrapper({ locationId, projectData }: { locationId: string, projectData: any }) {
    const locationData = await getLocationDetails(locationId);
    if (!locationData) return null;
    return (
        <div className="space-y-4 md:space-y-6">
            {projectData?.builder && (
                <div id="developer" className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
                    <DeveloperDetail project={projectData} data={locationData} />
                </div>
            )}
            <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
                <Highlight data={locationData} />
            </div>
            {locationData?.pricings && locationData.pricings.length > 0 && (
                <div id="price-trend" className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
                    <PriceTrendSection data={locationData as any} />
                    <PriceTrendSchema trends={locationData?.pricings} />
                </div>
            )}
            <div id="gallery">
                <PropertyGallery data={locationData} />
            </div>
        </div>
    );
}

async function SimilarProjectsWrapper({ locationId, projectId, type }: { locationId: string, projectId: string, type: string }) {
    const similarProjects = await getSimilarProjects(locationId);
    const UniqueSimilarProject = similarProjects?.filter((data) => data?.id !== projectId);
    
    if (type === 'compare') {
        return <CompareCarousel data={UniqueSimilarProject} />;
    }
    return <SimilarProject data={UniqueSimilarProject} />;
}

export default PropertyDetails
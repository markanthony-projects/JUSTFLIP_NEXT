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
import bcd from "@/public/banners/bcd.png"

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
const LocationImageGallery = dynamic(() => import('@/src/app/(justflip)/components/Project/ProjectGallery'));
const LeadForm = dynamic(() => import('@/src/components/molecules/LeadForm'));
const CompareCarousel = dynamic(() => import('@/src/app/(justflip)/components/Project/CompareProject'));
const SimilarProject = dynamic(() => import('@/src/app/(justflip)/components/Project/SimilarProject'));
const FAQ = dynamic(() => import('@/src/app/(justflip)/components/FAQ'));
const SocialMedia = dynamic(() => import('@/src/app/(justflip)/components/Project/socialMedia'));
import { constructMetadata } from "@/src/utils/seo";
import { buildRealEstateSchema } from "@/src/utils/schema";
import Link from 'next/link';
import Image from 'next/image';
import ScrollToTop from '@/src/components/atoms/ScrollToTop';

const FloatingActions = dynamic(() => import('@/src/app/(justflip)/components/Project/FloatingActions'));

type ProjectPageProps = {
    params: Promise<{ city: string; zone: string; location: string; slug: string }>;
};
export async function generateMetadata({ params }: ProjectPageProps) {
    const { city, zone, location, slug } = await params;
    const { cityName, locationName, name, id } = parseProjectUrl(city, zone, location, slug);
    const data = await getProjectPageData(id);
    if (!data || !data.projectData) return {};
    const { projectData } = data;

    const title = projectData ? `${projectData.name} in ${locationName}, ${cityName} - Price, Floor Plans, Reviews` : `${name} Properties | Justflip`;
    const description = projectData?.description ? projectData.description.replace(/<[^>]+>/g, '').substring(0, 157) + '...' : `Explore ${name} located in ${locationName}, ${cityName}. View exact pricing, 2/3/4 BHK floor plans, amenities, and read verified reviews.`;
    const url = `/properties/${city}/${zone}/${location}/${slug}`;

    return constructMetadata({
        title,
        description,
        canonical: url,
        image: projectData?.displayImage || 'https://justflip.in/logo.png'
    });
}

export const revalidate = 1800;

async function PropertyDetails({ params }: ProjectPageProps) {
    const { city, zone, location, slug } = await params;
    const { cityName, zoneName, locationName, name, id } = parseProjectUrl(city, zone, location, slug)
    const data = await getProjectPageData(id);

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

    const realEstateSchema = buildRealEstateSchema({
        name: projectData?.name || name,
        description: projectData?.description,
        url: `/properties/${city}/${zone}/${location}/${slug}`,
        locationName,
        cityName,
        price: projectData?.minPrice
    });

    const staticAddSection = {
        src: bcd,
        alt: 'GOLF-LINK BCD',
        href: 'https://justflip.in/bengaluru/east/hoskote/bcd-codename-golf-links/5ac3a691-3c70-4354-863e-10a3f4108c64'
    }

    return (
        <>
            <ScrollToTop />
            <div className='w-full max-w-full overflow-x-hidden px-2 md:px-4'>
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(realEstateSchema) }} />

                <Breadcrumb items={breadcrumbItems} />

                <Description project={projectData} />

                {/* <ImageBanner project={projectData} /> */}

                {/* <Suspense fallback={<PropertyHeaderSkeleton />} >
                    <PropertyHeader project={projectData} />
                </Suspense>

                <div className='hidden lg:block'>
                    <Suspense fallback={<FloatingActionsSkeleton />} >
                        <SocialMedia />
                    </Suspense>
                </div> */}

                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-6 xl:grid-cols-7 gap-2 lg:gap-4">
                    <div className="lg:col-span-4 xl:col-span-5 ">
                        <div className="px-2 md:px-4 py-1 md:py-2 space-y-4 w-full rounded-xl shadow-[0px_0px_10px_1px_#dad6d6]">
                            <Suspense fallback={<ProjectOverviewSkeleton />} >
                                <ProjectOverview project={projectData} />
                            </Suspense>

                            <div className="border-[#BABABA] border-b-[0.5px] mx-2" />
                            <Suspense fallback={<UnitTableSkeleton />} >
                                <UnitTable project={projectData} />
                            </Suspense>

                            <div className="border-[#BABABA] border-b-[0.5px] mx-2" />
                            <Suspense fallback={<FeaturesSkeleton />} >
                                <Features project={projectData} />
                            </Suspense>

                            <div className="border-[#BABABA] border-b-[0.5px] mx-2" />
                            <Suspense fallback={<ExploreMapSkeleton />} >
                                <ExploreMap project={projectData} />
                            </Suspense>
                            <div className="border-[#BABABA] border-b-[0.5px] mx-2 hidden lg:block" />
                            <Suspense fallback={<HighlightProjectSkeleton />} >
                                <HighlightsProject project={projectData} />
                            </Suspense>

                            <Suspense fallback={<ReviewsSkeleton />} >
                                <ReviewsWrapper projectId={id} projectName={projectData?.name} />
                            </Suspense>
                            <Suspense fallback={
                                <>
                                    <DeveloperLegacySkeleton />
                                    <HighlightSkeleton />
                                    <PriceTrendSkeleton />
                                    <LocationImageGallerySkeleton />
                                </>
                            }>
                                <LocationInfoWrapper locationId={locationId} projectData={projectData} />
                            </Suspense>

                        </div>
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
                        <div className=" lg:mt-0 hidden md:flex md:flex-col gap-4" >
                            <Suspense fallback={<CallbackFormSkeleton />}>
                                <LeadForm data={projectData} />
                            </Suspense>
                            <Suspense fallback={<CompareCarouselSkeleton />} >
                                <SimilarProjectsWrapper locationId={locationId} projectId={id} type="compare" />
                            </Suspense>
                        </div>
                    </div>
                </div>

                <section className="lg:hidden block">
                    <FloatingActions data={projectData} />
                </section>
                <Suspense fallback={<SimilarPropertiesSkeleton />}>
                    <SimilarProjectsWrapper locationId={locationId} projectId={id} type="similar" />
                </Suspense>
                <Suspense fallback={<FAQSkeleton />}>
                    <FAQ data={projectData} />
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
        <>
            <DeveloperDetail project={projectData} data={locationData} />
            <Highlight data={locationData} />
            <PriceTrendSection data={locationData as any} />
            <PriceTrendSchema trends={locationData?.pricings} />
            <LocationImageGallery data={locationData} />
        </>
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
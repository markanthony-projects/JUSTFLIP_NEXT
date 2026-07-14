import React, { Suspense } from 'react'
import { getProjectPageData } from '@/src/app/(justflip)/components/CityComponent/city.server';
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

const Description = dynamic(() => import('@/src/app/(justflip)/components/Project/Description'), { suspense: true });
const ImageBanner = dynamic(() => import('@/src/app/(justflip)/components/Project/ImageBanner'), { suspense: true });
const PropertyHeader = dynamic(() => import('@/src/app/(justflip)/components/Project/PropertyHeader'), { suspense: true });
const ProjectOverview = dynamic(() => import('@/src/app/(justflip)/components/Project/ProjectOverview'), { suspense: true });
const UnitTable = dynamic(() => import('@/src/app/(justflip)/components/Project/UnitTable'), { suspense: true });
const Features = dynamic(() => import('@/src/app/(justflip)/components/Project/Feature'), { suspense: true });
const ExploreMap = dynamic(() => import('@/src/app/(justflip)/components/Project/ExploreMap'), { suspense: true });
const HighlightsProject = dynamic(() => import('@/src/app/(justflip)/components/Project/HighlightsProject'), { suspense: true });
const ReviewsSectionClient = dynamic(() => import('@/src/app/(justflip)/components/CityComponent/ReviewsSectionClient'), { suspense: true });
const DeveloperDetail = dynamic(() => import('@/src/app/(justflip)/components/Project/DeveloperDetail'), { suspense: true });
const Highlight = dynamic(() => import('@/src/app/(justflip)/components/Highlight'), { suspense: true });
const PriceTrendSection = dynamic(() => import('@/src/components/trendGraph/PriceTrendSection'), { suspense: true });
const LocationImageGallery = dynamic(() => import('@/src/app/(justflip)/components/Project/ProjectGallery'), { suspense: true });
const LeadForm = dynamic(() => import('@/src/components/molecules/LeadForm'), { suspense: true });
const CompareCarousel = dynamic(() => import('@/src/app/(justflip)/components/Project/CompareProject'), { suspense: true });
const SimilarProject = dynamic(() => import('@/src/app/(justflip)/components/Project/SimilarProject'), { suspense: true });
const FAQ = dynamic(() => import('@/src/app/(justflip)/components/FAQ'), { suspense: true });
const SocialMedia = dynamic(() => import('@/src/app/(justflip)/components/Project/socialMedia'), { suspense: true });
import { constructMetadata } from "@/src/utils/seo";
import { buildRealEstateSchema } from "@/src/utils/schema";

const FloatingActions = dynamic(() => import('@/src/app/(justflip)/components/Project/FloatingActions'), { suspense: true });

export async function generateMetadata({ params }) {
    const { city, zone, location, slug } = await params;
    const { cityName, locationName, name, id } = parseProjectUrl(city, zone, location, slug);
    const { projectData } = await getProjectPageData(id);

    const title = projectData ? `${projectData.name} - ${locationName}, ${cityName} | Justflip` : `${name} Properties | Justflip`;
    const description = projectData?.description ? projectData.description.replace(/<[^>]+>/g, '').substring(0, 160) : `Explore ${name} located in ${locationName}, ${cityName}.`;
    const url = `/properties/${city}/${zone}/${location}/${slug}`;

    return constructMetadata({
        title,
        description,
        canonical: url,
        image: projectData?.displayImage || 'https://justflip.in/logo.png'
    });
}

export const revalidate = 3600;

async function PropertyDetails({ params }) {
    const { city, zone, location, slug } = await params;
    const { cityName, zoneName, locationName, name, id } = parseProjectUrl(city, zone, location, slug)
    const { projectData, reviewData, locationData, similarProjects } = await getProjectPageData(id);

    const UniqueSimilarProject = similarProjects?.filter((data) => data?.id !== projectData?.id);
    const cityUrl = createCityUrl(cityName, projectData?.city?.id)
    const zoneUrl = createZoneUrl(cityName, projectData?.zone?.name, projectData?.zone?.id)
    const locationUrl = createLocationUrl(cityName, zoneName, locationName, projectData?.location?.id)

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

    return (
        <div className=''>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(realEstateSchema) }} />

            <Breadcrumb items={breadcrumbItems} />

            <Description project={projectData} />

            {/* <ImageBanner project={projectData} /> */}

            <Suspense fallback={<PropertyHeaderSkeleton />} >
                <PropertyHeader project={projectData} />
            </Suspense>

            <div className='hidden lg:block'>
                <Suspense fallback={<FloatingActionsSkeleton />} >
                    <SocialMedia />
                </Suspense>
            </div>

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
                            <ReviewsSectionClient typeName={projectData?.name} typeId={projectData?.id} type="project" reviews={reviewData} />
                        </Suspense>
                        <Suspense fallback={<DeveloperLegacySkeleton />} >
                            <DeveloperDetail project={projectData} data={locationData} />
                        </Suspense>
                        <Suspense fallback={<HighlightSkeleton />} >
                            <Highlight data={locationData} />
                        </Suspense>
                        <Suspense fallback={<PriceTrendSkeleton />} >
                            <PriceTrendSection data={locationData} />
                        </Suspense>

                        <PriceTrendSchema trends={locationData?.pricings} />

                        <Suspense fallback={<LocationImageGallerySkeleton />} >
                            <LocationImageGallery data={locationData} />
                        </Suspense>

                    </div>
                </div>

                <div className="hidden lg:block lg:col-span-2 xl:col-span-2">
                    <div className=" lg:mt-0 hidden md:flex md:flex-col gap-4" >
                        <Suspense fallback={<CallbackFormSkeleton />}>
                            <LeadForm data={projectData} />
                        </Suspense>
                        <Suspense fallback={<CompareCarouselSkeleton />} >
                            <CompareCarousel data={UniqueSimilarProject} />
                        </Suspense>
                    </div>
                </div>
            </div>

            <section className="lg:hidden block  -bottom-13 right-5 fixed z-10">
                <FloatingActions data={projectData} />
            </section>
            <Suspense fallback={<SimilarPropertiesSkeleton />}>
                <SimilarProject data={UniqueSimilarProject} />
            </Suspense>
            <Suspense fallback={<FAQSkeleton />}>
                <FAQ data={projectData} />
            </Suspense>

        </div>
    )
}

export default PropertyDetails
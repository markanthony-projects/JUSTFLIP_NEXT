import Breadcrumb from '@/src/components/organisms/breadCrumb';
import { notFound } from 'next/navigation';
import { createCityUrl, createZoneUrl, parseLocationUrl } from '@/src/utils/url';
import React, { Suspense } from 'react';
import { getLocationPageData } from '@/src/app/(justflip)/components/CityComponent/city.server';
import HeaderTop from '@/src/app/(justflip)/components/HeaderTop';

import { TopPropertySkeleton } from '@/src/app/(justflip)/components/Skelton/TopPropertySkeleton';
import { RatingCardSkeleton } from '@/src/app/(justflip)/components/Skelton/RatingCardSkeleton';
import { TopBuildersSkeleton } from '@/src/app/(justflip)/components/Skelton/TopBuildersSkeleton';
import { HighlightSkeleton } from '@/src/app/(justflip)/components/Skelton/HighlightSkeleton';
import dynamic from 'next/dynamic';
import { BlogsSkeleton } from '@/src/app/(justflip)/components/Skelton/BlogsSkelton';
import { GallerySkeleton } from '@/src/app/(justflip)/components/Skelton/GallerySkeleton';
import { FAQSkeleton } from '@/src/app/(justflip)/components/Skelton/FAQSkeleton';
import { PropertySupplySkeleton } from '@/src/app/(justflip)/components/Skelton/PropertySupplySkeleton';
import LocationAroundSkeleton from '@/src/app/(justflip)/components/Skelton/LocationAroundSkeleton';
import AreasNearbySkeleton from '@/src/app/(justflip)/components/Skelton/AreasNearbySkeleton';
import MapFilterSkeleton from '@/src/app/(justflip)/components/Skelton/MapFilterSkeleton';
import PriceTrendSchema from '@/src/components/seo/PriceTrendSchema';
import { ReviewsSkeleton } from '@/src/app/(justflip)/components/Skelton/ReviewsSkeleton';
import PriceTrendSkeleton from '@/src/app/(justflip)/components/Skelton/PriceTrendSkeleton';

const BuildersSection = dynamic(() => import("@/src/app/(justflip)/components/CityComponent/BuilderSection"));
const PriceTrendClient = dynamic(() => import("@/src/app/(justflip)/components/PriceTrendClient"));
const TopProperty = dynamic(() => import("@/src/app/(justflip)/components/TopProperty"));
const Highlight = dynamic(() => import("@/src/app/(justflip)/components/Highlight"));
const Blogs = dynamic(() => import("@/src/app/(justflip)/components/Blogs"));
const PropertyGallery = dynamic(() => import("@/src/app/(justflip)/components/PropertyGallery"));
const FAQ = dynamic(() => import("@/src/app/(justflip)/components/FAQ"));
const PropertySupply = dynamic(() => import("@/src/app/(justflip)/components/PropertySupply"));
const LocationAround = dynamic(() => import("@/src/app/(justflip)/components/Location/LocationAround"));
const AreasNearby = dynamic(() => import("@/src/app/(justflip)/components/Location/AreasNearby/AreasNearby"));
const GoogleMapFilter = dynamic(() => import("@/src/app/(justflip)/components/map/GoogleMapFilter"));
const PriceTrendSection = dynamic(() => import("@/src/components/trendGraph/PriceTrendSection"));
const ReviewsSectionClient = dynamic(() => import("@/src/app/(justflip)/components/CityComponent/ReviewsSectionClient"));
import { constructMetadata } from "@/src/utils/seo";
import { Metadata } from 'next';
import ScrollToTop from '@/src/components/atoms/ScrollToTop';

const locationNavItems = [
  { id: "overview", label: "Overview" },
  { id: "ratings", label: "Ratings", className: "block md:hidden"},
  { id: "top", label: "Top Properties", className: "block md:hidden"},
  { id: "properties", label: "Explore More Properties"},
  { id: "highlights", label: "Location Highlights" },
  { id: "price-trend", label: "Price Trend"},
  { id: "builders", label: "Top Builders" },
  { id: "nearby", label: "Neighborhood"},
  { id: "reviews", label: "Reviews" },
  { id: "areas", label: "Nearby Areas"},
  { id: "gallery", label: "Gallery" },
  { id: "location", label: "Location&Connectivity"},
  { id: "blogs", label: "Blogs" },
  { id: "faq", label: "Frequently Asked Questions" },
];

type LocationPageProps = {
  params: Promise<{ city: string; zone: string; location: string }>;
};

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const { city, zone, location } = await params;
  const { cityName, name, id } = parseLocationUrl(city, zone, location);
  let locationData: any = null;
  try {
    const data = await getLocationPageData(id);
    locationData = data?.locationData || null;
  } catch {
    locationData = null;
  }

  const title = `Properties in ${name || 'Location'}, ${cityName} - Buy Flats, Villas & Plots | JustFlip`;
  const description = locationData?.description?.trim()
    ? locationData.description.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().substring(0, 157) + '...'
    : `Explore verified residential properties, flats, and villas in ${name || 'Location'}, ${cityName}. View prices, photos, and builder reviews on JustFlip.`;

  return constructMetadata({
    title,
    description,
    canonical: `/properties/${city}/${zone}/${location}`
  });
}

import LocationLoading from './LocationLoading';
import PropertyDetailNavTabs from '@/src/app/(justflip)/components/PropertyDetailsNavTabs';
import ExploreMap from '@/src/app/(justflip)/components/Project/ExploreMap';

export const revalidate = 1800;

export default function LocationPage(props: LocationPageProps) {
  return (
    <Suspense fallback={<LocationLoading />}>
      <LocationPageContent {...props} />
    </Suspense>
  );
}

async function LocationPageContent({ params }: LocationPageProps) {
  const { city, zone, location } = await params;
  const { cityName, zoneName, name, id } = parseLocationUrl(city, zone, location);
  const data = await getLocationPageData(id);

  if (!data || !data.locationData) {
    return notFound();
  }

  const { locationData, builders, reviewData, reviewList, trends } = data;
  const cityUrl = createCityUrl(cityName, locationData?.zone?.city?.id);
  const zoneUrl = createZoneUrl(cityName, name, locationData?.zone?.id);

  const breadcrumbItems = [
    { label: "Properties", href: "/properties" },
    { label: cityName || "City Details", href: `${cityUrl}` },
    { label: zoneName || "Zone Details", href: `${zoneUrl}` },
    { label: name }
  ];

  const bannerImage = locationData?.medias?.find((o: any) => o.title === 'logo');

  return (
    <div className="w-full">
      <ScrollToTop />
      <Breadcrumb items={breadcrumbItems} />

      <PropertyDetailNavTabs navItems={locationNavItems} scrollThreshold={20} showArrows={true}/>

      <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-4 gap-6 mx-auto">
        {/* Left Column: Stack of individual, clean tile cards */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-4 md:space-y-6">

          {/* 1. Header / Location Overview */}
          <div id="overview">
            <HeaderTop data={locationData} bannerImage={bannerImage} />
          </div>

          {/* Mobile Sidebar Cards */}
          <div className="block lg:hidden space-y-4">
            <div id="ratings">
              <Suspense fallback={<RatingCardSkeleton />}>
                <PriceTrendClient data={reviewData || {}} trendData={trends as any} type={"location"} typeId={id} />
              </Suspense>
            </div>

            <div id="top">
              <Suspense fallback={<TopPropertySkeleton />}>
                <TopProperty typeId={id} type={"location"} />
              </Suspense>
            </div>
          </div>

          {/* 2. Explore Properties by Category & Price Filter */}
          <div id="properties">
            <Suspense fallback={<PropertySupplySkeleton />}>
              <PropertySupply type="location" data={locationData as any} typeName={name} typeId={id} />
            </Suspense>
          </div>

          {/* 3. Highlights Tile */}
          <div id="highlights" className="bg-white rounded-lg p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
            <Suspense fallback={<HighlightSkeleton />}>
              <Highlight data={locationData} />
            </Suspense>
          </div>

          {/* 4. Price Trends Tile */}
          <div id="price-trend" className="bg-white rounded-lg p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
            <Suspense fallback={<PriceTrendSkeleton />}>
              <PriceTrendSection data={locationData as any} />
            </Suspense>
            <PriceTrendSchema trends={locationData?.pricings} />
          </div>

          {/* 5. Top Builders Tile */}
          <div id="builders" className="bg-white rounded-lg p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
            <Suspense fallback={<TopBuildersSkeleton />}>
              <BuildersSection builders={builders} city={locationData?.city} />
            </Suspense>
          </div>

          {/* 6. Location Around & Services Tile */}
          <div id="nearby" className="bg-white rounded-lg p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
            <Suspense fallback={<LocationAroundSkeleton />}>
              <LocationAround services={locationData?.services} />
            </Suspense>
          </div>

          {/* 7. Ratings & Reviews Tile */}
          <div id="reviews" className="bg-white rounded-lg p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
            <Suspense fallback={<ReviewsSkeleton />}>
              <ReviewsSectionClient typeName={name} typeId={id} type="location" reviews={reviewList} />
            </Suspense>
          </div>

          {/* 8. Areas Nearby Tile */}
          <div id="areas" className="bg-white rounded-lg p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
            <Suspense fallback={<AreasNearbySkeleton />}>
              <AreasNearby locationData={locationData} />
            </Suspense>
          </div>

          {/* 9. Photo Gallery */}
          <div id="gallery">
            <Suspense fallback={<GallerySkeleton />}>
              <PropertyGallery data={locationData} title={`${name} - At a Glance`} />
            </Suspense>
          </div>

          {/* 10. Interactive Map Tile */}
          <div id="location" className="bg-white rounded-lg p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
            <Suspense fallback={<MapFilterSkeleton />}>
              <ExploreMap project={locationData} />
            </Suspense>
          </div>

        </div>

        {/* Right Column: Sticky Sidebar fixed on the right */}
        <div className="sticky top-28 self-start lg:col-span-2 xl:col-span-1 hidden lg:flex lg:flex-col lg:gap-4">
          <Suspense fallback={<RatingCardSkeleton />}>
            <PriceTrendClient data={reviewData || {}} trendData={trends as any} type={"location"} typeId={id} />
          </Suspense>
          <Suspense fallback={<TopPropertySkeleton />}>
            <TopProperty typeId={id} type={"location"} />
          </Suspense>
        </div>

      </div>

      {/* Full-Width Centered Sections Below Grid */}
      <div className="w-full space-y-8 my-8">
        <div id="blogs" className='bg-white rounded-lg p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)]'>
          <Suspense fallback={<BlogsSkeleton />}>
            <Blogs tag="Popular Blogs" />
          </Suspense>
        </div>

        <div id="faq">
          <Suspense fallback={<FAQSkeleton />}>
            <FAQ data={locationData} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

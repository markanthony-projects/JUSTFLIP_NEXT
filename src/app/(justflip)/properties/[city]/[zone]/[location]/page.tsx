import Breadcrumb from '@/src/components/organisms/breadCrumb';
import { notFound } from 'next/navigation';
import { createCityUrl, createZoneUrl, parseLocationUrl } from '@/src/utils/url';
import React, { Suspense } from 'react'
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
const Highlight = dynamic(() => import("@/src/app/(justflip)/components/Highlight") );
const Blogs = dynamic(() => import("@/src/app/(justflip)/components/Blogs") );
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

type LocationPageProps = {
  params: Promise<{ city: string; zone: string; location: string }>;
};

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const { city, zone, location } = await params;
  const { cityName, name, id } = parseLocationUrl(city, zone, location);
  const data = await getLocationPageData(id);
  if (!data || !data.locationData) return {};
  const { locationData } = data;

  const title = `Properties in ${name}, ${cityName} - Buy Flats, Villas & Plots | JustFlip`;
  const description = locationData?.description ? locationData.description.replace(/<[^>]+>/g, '').substring(0, 157) + '...' : `Explore verified residential properties, flats, and villas in ${name}, ${cityName}. View prices, photos, and builder reviews.`;

  return constructMetadata({
    title,
    description,
    canonical: `/properties/${city}/${zone}/${location}`
  });
}

export const revalidate = 1800;

export default async function LocationPage({ params }: LocationPageProps) {
  const { city, zone, location } = await params;
  const { cityName, zoneName, name, id } = parseLocationUrl(city, zone, location)
  const data = await getLocationPageData(id)

  if (!data || !data.locationData) {
    return notFound();
  }

  const { locationData, builders, reviewData, reviewList, trends } = data;
  const cityUrl = createCityUrl(cityName, locationData?.zone?.city?.id)
  const zoneUrl = createZoneUrl(cityName, name, locationData?.zone?.id)

  const breadcrumbItems = [
    { label: "Properties", href: "/properties" },
    { label: cityName || "City Details", href: `${cityUrl}` },
    { label: zoneName || "Zone Details", href: `${zoneUrl}` },
    { label: name }];

  const bannerImage = locationData?.medias?.find((o: any) => o.title === 'logo')

  return (
    <div className="w-full px-2 md:px-4">
      <Breadcrumb items={breadcrumbItems} />

      <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-4 gap-6 mx-auto">
        {/* Left Column: Stack of individual, clean tile cards */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-4 md:space-y-6">

          {/* 1. Header / Location Overview */}
          <HeaderTop data={locationData} bannerImage={bannerImage} />

          {/* Mobile Sidebar Cards */}
          <div className="block lg:hidden space-y-4">
            <Suspense fallback={<RatingCardSkeleton />}>
              <PriceTrendClient data={reviewData || {}} trendData={trends as any} type={"location"} typeId={id} />
            </Suspense>
            <Suspense fallback={<TopPropertySkeleton />}>
              <TopProperty typeId={id} type={"location"} />
            </Suspense>
          </div>

          {/* 2. Explore Properties by Category & Price Filter */}
          <Suspense fallback={<PropertySupplySkeleton />}>
            <PropertySupply type="location" data={locationData as any} typeName={name} typeId={id} />
          </Suspense>

          {/* 3. Highlights Tile */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
            <Suspense fallback={<HighlightSkeleton />}>
              <Highlight data={locationData} />
            </Suspense>
          </div>

          {/* 4. Price Trends Tile */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
            <Suspense fallback={<PriceTrendSkeleton />}>
              <PriceTrendSection data={locationData as any} />
            </Suspense>
            <PriceTrendSchema trends={locationData?.pricings} />
          </div>

          {/* 5. Top Builders Tile */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
            <Suspense fallback={<TopBuildersSkeleton />}>
              <BuildersSection builders={builders} city={locationData?.city} />
            </Suspense>
          </div>

          {/* 6. Location Around & Services Tile */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
            <Suspense fallback={<LocationAroundSkeleton />}>
              <LocationAround services={locationData?.services} />
            </Suspense>
          </div>

          {/* 7. Ratings & Reviews Tile */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
            <Suspense fallback={<ReviewsSkeleton />}>
              <ReviewsSectionClient typeName={name} typeId={id} type="location" reviews={reviewList} />
            </Suspense>
          </div>

          {/* 8. Areas Nearby Tile */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
            <Suspense fallback={<AreasNearbySkeleton />}>
              <AreasNearby locationData={locationData} />
            </Suspense>
          </div>

          {/* 9. Photo Gallery */}
          <Suspense fallback={<GallerySkeleton />}>
            <PropertyGallery data={locationData} title={`${name} - At a Glance`} />
          </Suspense>

          {/* 10. Interactive Map Tile */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
            <Suspense fallback={<MapFilterSkeleton />}>
              <GoogleMapFilter locationData={locationData} />
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
        <Suspense fallback={<BlogsSkeleton />}>
          <Blogs tag="Popular Blogs" />
        </Suspense>

        <Suspense fallback={<FAQSkeleton />}>
          <FAQ data={locationData} />
        </Suspense>
      </div>
    </div>
  );
}

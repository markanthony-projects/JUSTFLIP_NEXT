import Breadcrumb from '@/src/components/organisms/breadCrumb';
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


const BuildersSection = dynamic(() => import("@/src/app/(justflip)/components/CityComponent/BuilderSection"),{ suspense: true });
const PriceTrendClient = dynamic(() => import("@/src/app/(justflip)/components/PriceTrendClient"),{ suspense: true });
const TopProperty = dynamic(() => import("@/src/app/(justflip)/components/TopProperty"),{ suspense: true });
const Highlight = dynamic(() => import("@/src/app/(justflip)/components/Highlight"),{ suspense: true } );
const Blogs = dynamic(() => import("@/src/app/(justflip)/components/Blogs"),{ suspense: true } );
const Gallery = dynamic(() => import("@/src/app/(justflip)/components/CityComponent/gallery"),{ suspense: true });
const FAQ = dynamic(() => import("@/src/app/(justflip)/components/FAQ"), { suspense: true });
const PropertySupply = dynamic(() => import("@/src/app/(justflip)/components/PropertySupply"),{ suspense: true } );
const LocationAround = dynamic(() => import("@/src/app/(justflip)/components/Location/LocationAround"),{ suspense: true } );
const AreasNearby = dynamic(() => import("@/src/app/(justflip)/components/Location/AreasNearby/AreasNearby"),{ suspense: true } );
const GoogleMapFilter = dynamic(() => import("@/src/app/(justflip)/components/map/GoogleMapFilter"),{ suspense: true } );
const PriceTrendSection = dynamic(() => import("@/src/components/trendGraph/PriceTrendSection"),{ suspense: true } );
const ReviewsSectionClient = dynamic(() => import("@/src/app/(justflip)/components/CityComponent/ReviewsSectionClient"),{ suspense: true });
import { constructMetadata } from "@/src/utils/seo";
import { buildBreadcrumbSchema } from "@/src/utils/schema";

export async function generateMetadata({ params }) {
  const { city, zone, location } = await params;
  const { cityName, zoneName, name, id } = parseLocationUrl(city, zone, location);
  const { locationData } = await getLocationPageData(id);

  const title = `Buy Flats, Villas & Plots in ${name}, ${cityName} - Photos & Prices | JustFlip`;
  const description = locationData?.description ? locationData.description.replace(/<[^>]+>/g, '').substring(0, 157) + '...' : `Find the best residential projects, luxury apartments, and plots available in ${name}, ${cityName}. View 100+ properties with floor plans and price trends.`;
  
  return constructMetadata({
    title,
    description,
    canonical: `/properties/${city}/${zone}/${location}`
  });
}

export const revalidate = 3600;

export default async function LocationPage({ params }) {
  const { city, zone, location } = await params;
  const { cityName, zoneName, name, id } = parseLocationUrl(city, zone, location)
  const { locationData, builders, reviewData, reviewList, trends, } = await getLocationPageData(id);
  const cityUrl = createCityUrl(cityName, locationData?.city?.id)
  const zoneUrl = createZoneUrl(cityName, name, locationData?.zone?.id)

  const breadcrumbItems = [
    { label: "Properties", href: "/properties" },
    { label: cityName || "City Details", href: `${cityUrl}` },
    { label: zoneName || "Zone Details", href: `${zoneUrl}` },
    { label: name }];

  const bannerImage = locationData?.medias?.find(o => o.title === 'logo')

  return (
    <div className="">
      <Breadcrumb items={breadcrumbItems} />
      <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-4 gap-6">
        <div className="lg:col-span-4 xl:col-span-3 space-y-4">
          <HeaderTop data={locationData} bannerImage={bannerImage} />

          <div className="block lg:hidden">
            <Suspense fallback={<RatingCardSkeleton />}>
              <PriceTrendClient data={reviewData} trendData={trends} type={"location"} typeId={id} />
            </Suspense>
            <Suspense fallback={<TopPropertySkeleton />}>
              <TopProperty typeId={id} type={"location"} />
            </Suspense>
          </div>

          <Suspense fallback={<HighlightSkeleton />}>
            <Highlight data={locationData} />
          </Suspense>

          <Suspense fallback={<PriceTrendSkeleton />}>
            <PriceTrendSection data={locationData} />
          </Suspense>
          <PriceTrendSchema trends={locationData?.pricings} />

          <Suspense fallback={<TopBuildersSkeleton />}>
            <BuildersSection builders={builders} />
          </Suspense>

          <Suspense fallback={<LocationAroundSkeleton />}>
            <LocationAround services={locationData?.services} />
          </Suspense>

          <Suspense fallback={<PropertySupplySkeleton />}>
            <PropertySupply typeName="location" typeId={id} />
          </Suspense>

          <Suspense fallback={<ReviewsSkeleton />}>
            <ReviewsSectionClient typeName={name} typeId={id} type="location" reviews={reviewList} />
          </Suspense>

          <Suspense fallback={<AreasNearbySkeleton />}>
            <AreasNearby locationData={locationData} />
          </Suspense>
          <Suspense fallback={<BlogsSkeleton />}>
            <Blogs tag="Popular Blogs" />
          </Suspense>
          <Suspense fallback={<MapFilterSkeleton />}>
            <GoogleMapFilter locationData={locationData} />
          </Suspense>
          <Suspense fallback={<GallerySkeleton />}>
            <Gallery data={locationData} />
          </Suspense>
          <Suspense fallback={<FAQSkeleton />}>
            <FAQ data={locationData} />
          </Suspense>

        </div>
        <div className="lg:col-span-2 xl:col-span-1 md:m-2 hidden lg:flex lg:flex-col lg:gap-4">
          <Suspense fallback={<RatingCardSkeleton />}>
            <PriceTrendClient data={reviewData} trendData={trends} type={"location"} typeId={id} />
          </Suspense>
          <Suspense fallback={<TopPropertySkeleton />}>
            <TopProperty typeId={id} type={"location"} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
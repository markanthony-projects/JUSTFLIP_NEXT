import Breadcrumb from '@/src/components/organisms/breadCrumb';
import { notFound } from 'next/navigation';
import { createCityUrl, parseZoneUrl } from '@/src/utils/url';
import React, { Suspense } from 'react'
import { getZonePageData } from '../../../components/CityComponent/city.server';
import HeaderTop from '../../../components/HeaderTop';
import { TopBuildersSkeleton } from '../../../components/Skelton/TopBuildersSkeleton';
import { TopPropertySkeleton } from '../../../components/Skelton/TopPropertySkeleton';
import { RatingCardSkeleton } from '../../../components/Skelton/RatingCardSkeleton';
import { ReviewsSkeleton } from '../../../components/Skelton/ReviewsSkeleton';
import { HighlightSkeleton } from '../../../components/Skelton/HighlightSkeleton';
import { BlogsSkeleton } from '../../../components/Skelton/BlogsSkelton';
import { GallerySkeleton } from '../../../components/Skelton/GallerySkeleton';
import { PropertySupplySkeleton } from '../../../components/Skelton/PropertySupplySkeleton';
import dynamic from 'next/dynamic';
import { FAQSkeleton } from '../../../components/Skelton/FAQSkeleton';

const BuildersSection = dynamic(() => import("../../../components/CityComponent/BuilderSection"));
const TopProperty = dynamic(() => import("../../../components/TopProperty"));
const PriceTrendClient = dynamic(() => import("../../../components/PriceTrendClient"));
const ReviewsSectionClient = dynamic(() => import("../../../components/CityComponent/ReviewsSectionClient"));
const Highlight = dynamic(() => import("../../../components/Highlight"));
const Blogs = dynamic(() => import("../../../components/Blogs"));
const Gallery = dynamic(() => import("../../../components/CityComponent/gallery"));
const FAQ = dynamic(() => import("../../../components/FAQ"));
const PropertySupply = dynamic(() => import("../../../components/PropertySupply"));
import { constructMetadata } from "@/src/utils/seo";
import { Metadata } from 'next';

type ZonePageProps = {
  params: Promise<{ city: string; zone: string }>;
};

export async function generateMetadata({ params }: ZonePageProps): Promise<Metadata> {
  const { city, zone } = await params;
  const { cityName, name, id } = parseZoneUrl(city, zone);
  const data = await getZonePageData(id);
  if (!data || !data.zoneData) return {};
  const { zoneData } = data;

  const title = `Buy Flats, Villas & Plots in ${name}, ${cityName} - Photos & Prices | JustFlip`;
  const description = zoneData?.description ? zoneData.description.replace(/<[^>]+>/g, '').substring(0, 157) + '...' : `Browse top residential properties, apartments, and villas for sale in ${name}, ${cityName}. Check latest prices, floor plans & reviews.`;
  
  return constructMetadata({
    title,
    description,
    canonical: `/properties/${city}/${zone}`
  });
}

export const revalidate = 1800;

export default async function ZonePage({ params }: ZonePageProps) {
  const { city, zone } = await params;
  const { cityName, name, id } = parseZoneUrl(city, zone)
  const data = await getZonePageData(id)

  if (!data || !data.zoneData) {
    return notFound();
  }

  const { zoneData, builders, reviewData, reviewList, trends } = data;
  const cityUrl = createCityUrl(cityName, zoneData?.city?.id)
  const breadcrumbItems = [{ label: "Properties", href: "/properties" }, { label: cityName || "City Details", href: `${cityUrl}`, }, { label: name }];
  const bannerImage = zoneData?.medias?.find((o: any) => o.title === 'logo')

  return (
    <div className="">
      <Breadcrumb items={breadcrumbItems} />
      <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-4 gap-6">
        <div className="lg:col-span-4 xl:col-span-3 space-y-4">
          <HeaderTop data={zoneData} bannerImage={bannerImage} zone={true} />

          <div className="block lg:hidden">
            <Suspense fallback={<TopPropertySkeleton />}>
              <TopProperty typeId={id} type={"zone"} />
            </Suspense>
            <Suspense fallback={<RatingCardSkeleton />}>
              <PriceTrendClient data={reviewData || {}} trendData={trends as any} type={"zone"} typeId={id} />
            </Suspense>
          </div>


          <Suspense fallback={<HighlightSkeleton />}>
            <Highlight data={zoneData} />
          </Suspense>

          <Suspense fallback={<TopBuildersSkeleton />}>
            <BuildersSection builders={builders} city={zoneData?.city} />
          </Suspense>

          <Suspense fallback={<PropertySupplySkeleton />}>
            <PropertySupply type="city" data={zoneData as any} typeName={name} typeId={id} />
          </Suspense>

          <Suspense fallback={<ReviewsSkeleton />}>
            <ReviewsSectionClient typeName={name} typeId={id} type="zone" reviews={reviewList} />
          </Suspense>

          <Suspense fallback={<BlogsSkeleton />}>
            <Blogs tag="Popular Blogs" />
          </Suspense>

          <Suspense fallback={<GallerySkeleton />}>
            <Gallery data={zoneData} />
          </Suspense>
          <Suspense fallback={<FAQSkeleton />}>
            <FAQ data={zoneData} />
          </Suspense>

        </div>
        <div className="lg:col-span-2 xl:col-span-1 md:m-2 hidden lg:flex lg:flex-col lg:gap-4">
          <Suspense fallback={<RatingCardSkeleton />}>
            <PriceTrendClient data={reviewData || {}} trendData={trends as any} type={"zone"} typeId={id} />
          </Suspense>
          <Suspense fallback={<TopPropertySkeleton />}>
            <TopProperty typeId={id} type={"zone"} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

import Breadcrumb from '@/src/components/organisms/breadCrumb';
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

const BuildersSection = dynamic(() => import("../../../components/CityComponent/BuilderSection"),{ suspense: true });
const TopProperty = dynamic(() => import("../../../components/TopProperty"),{ suspense: true });
const PriceTrendClient = dynamic(() => import("../../../components/PriceTrendClient"),{ suspense: true });
const ReviewsSectionClient = dynamic(() => import("../../../components/CityComponent/ReviewsSectionClient"),{ suspense: true });
const Highlight = dynamic(() => import("../../../components/Highlight"),{ suspense: true });
const Blogs = dynamic(() => import("../../../components/Blogs"),{ suspense: true });
const Gallery = dynamic(() => import("../../../components/CityComponent/gallery"),{ suspense: true });
const FAQ = dynamic(() => import("../../../components/FAQ"),{ suspense: true });
const PropertySupply = dynamic(() => import("../../../components/PropertySupply"),{ suspense: true });
import { constructMetadata } from "@/src/utils/seo";
import { buildBreadcrumbSchema } from "@/src/utils/schema";

export async function generateMetadata({ params }) {
  const { city, zone } = await params;
  const { cityName, name, id } = parseZoneUrl(city, zone);
  const { zoneData } = await getZonePageData(id);

  const title = `Properties in ${name}, ${cityName} | Real Estate | Justflip`;
  const description = zoneData?.description ? zoneData.description.replace(/<[^>]+>/g, '').substring(0, 160) : `Explore the latest residential properties, apartments, and villas in ${name}, ${cityName}.`;
  
  return constructMetadata({
    title,
    description,
    canonical: `/properties/${city}/${zone}`
  });
}

export const revalidate = 3600;

export default async function ZonePage({ params }) {
  const { city, zone } = await params;
  const { cityName, name, id } = parseZoneUrl(city, zone)
  const { zoneData, builders, reviewData, reviewList, trends, } = await getZonePageData(id)
  const cityUrl = createCityUrl(cityName, zoneData?.city?.id)
  const breadcrumbItems = [{ label: "Properties", href: "/properties" }, { label: cityName || "City Details", href: `${cityUrl}`, }, { label: name }];
  const bannerImage = zoneData?.medias?.find(o => o.title === 'logo')

  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbItems);

  return (
    <div className="">
      <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Breadcrumb items={breadcrumbItems} />
      <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-4 gap-6">
        <div className="lg:col-span-4 xl:col-span-3 space-y-4">
          <HeaderTop data={zoneData} bannerImage={bannerImage} zone={true} />

          <div className="block lg:hidden">
            <Suspense fallback={<TopPropertySkeleton />}>
              <TopProperty typeId={id} type={"zone"} />
            </Suspense>
            <Suspense fallback={<RatingCardSkeleton />}>
              <PriceTrendClient data={reviewData} trendData={trends} type={"zone"} typeId={id} />
            </Suspense>
          </div>


          <Suspense fallback={<HighlightSkeleton />}>
            <Highlight data={zoneData} />
          </Suspense>

          <Suspense fallback={<TopBuildersSkeleton />}>
            <BuildersSection builders={builders} />
          </Suspense>

          <Suspense fallback={<PropertySupplySkeleton />}>
            <PropertySupply type="city" data={zoneData} />
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
            <PriceTrendClient data={reviewData} trendData={trends} type={"zone"} typeId={id} />
          </Suspense>
          <Suspense fallback={<TopPropertySkeleton />}>
            <TopProperty typeId={id} type={"zone"} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
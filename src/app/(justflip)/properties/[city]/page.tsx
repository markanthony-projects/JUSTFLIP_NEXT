import Breadcrumb from "@/src/components/organisms/breadCrumb";
import { notFound } from 'next/navigation';
import { parseCityUrl } from "@/src/utils/url";
import { getCityPageData } from "../../components/CityComponent/city.server";
import HeaderTop from "../../components/HeaderTop";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { HighlightSkeleton } from "../../components/Skelton/HighlightSkeleton";
import { TopBuildersSkeleton } from "../../components/Skelton/TopBuildersSkeleton";
import { PropertySupplySkeleton } from "../../components/Skelton/PropertySupplySkeleton";
import { ReviewsSkeleton } from "../../components/Skelton/ReviewsSkeleton";
import { BlogsSkeleton } from "../../components/Skelton/BlogsSkelton";
import { GallerySkeleton } from "../../components/Skelton/GallerySkeleton";
import { FAQSkeleton } from "../../components/Skelton/FAQSkeleton";
import { RatingCardSkeleton } from "../../components/Skelton/RatingCardSkeleton";
import { TopPropertySkeleton } from "../../components/Skelton/TopPropertySkeleton";

const BuildersSection = dynamic(() => import("../../components/CityComponent/BuilderSection"));
const TopProperty = dynamic(() => import("../../components/TopProperty"));
const PriceTrendClient = dynamic(() => import("../../components/PriceTrendClient"));
const ReviewsSectionClient = dynamic(() => import("../../components/CityComponent/ReviewsSectionClient"));
const Highlight = dynamic(() => import("../../components/Highlight"));
const Blogs = dynamic(() => import("../../components/Blogs"));
const Gallery = dynamic(() => import("../../components/CityComponent/gallery"));
const PropertySupply = dynamic(() => import("../../components/PropertySupply"));
const FAQ = dynamic(() => import("../../components/FAQ"));
import { constructMetadata } from "@/src/utils/seo";
import { Metadata } from 'next';
import ScrollToTop from "@/src/components/atoms/ScrollToTop";


type CityPageProps = {
  params: Promise<{ city: string }>;
};

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { city } = await params;
  const { name, id } = parseCityUrl(city);
  const data = await getCityPageData(id);
  if (!data || !data.cityData) return {};
  const { cityData } = data;

  const title = `2/3/4 BHK Flats, Villas & Plots in ${name} - Prices, Photos | JustFlip`;
  const description = cityData?.description ? cityData.description.replace(/<[^>]+>/g, '').substring(0, 157) + '...' : `Browse 500+ verified properties, apartments, and villas for sale in ${name}. View photos, floor plans, and price trends. Find your dream home today!`.substring(0, 160);

  return constructMetadata({
    title,
    description,
    canonical: `/properties/${city}`
  });
}

export const revalidate = 1800;

export default async function CityPage({ params }: CityPageProps) {
  const { city } = await params;
  const { name, id } = parseCityUrl(city);

  // TEMPORARY ARTIFICIAL DELAY: Sleeps for 10 seconds to allow you to inspect the loading skeleton
  // await new Promise(resolve => setTimeout(resolve, 10000));

  const data = await getCityPageData(id);

  if (!data || !data.cityData) {
    return notFound();
  }

  const { cityData, builders, reviewData, reviewList, trends } = data;
  const breadcrumbItems = [{ label: "Properties", href: "/properties" }, { label: name }];
  const bannerImage = cityData?.medias?.find((o: any) => o.title === 'logo');

  return (
    <>
      <ScrollToTop />
      <Breadcrumb items={breadcrumbItems} />
      <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-4 gap-6 mx-auto">

        <div className="lg:col-span-4 xl:col-span-3 space-y-4">
          <HeaderTop data={cityData} bannerImage={bannerImage} />
          <div className="block lg:hidden space-y-4">
            <Suspense fallback={<TopPropertySkeleton />}>
              <TopProperty typeId={id} type={"city"} />
            </Suspense>
            <Suspense fallback={<RatingCardSkeleton />}>
              <PriceTrendClient data={reviewData || {}} trendData={trends as any} type={"city"} typeId={id} />
            </Suspense>
          </div>

          <Suspense fallback={<HighlightSkeleton />}>
            <Highlight data={cityData} />
          </Suspense>

          <Suspense fallback={<TopBuildersSkeleton />}>
            <BuildersSection builders={builders} city={cityData} />
          </Suspense>

          <Suspense fallback={<PropertySupplySkeleton />}>
            <PropertySupply type="city" data={cityData as any} typeName={name} typeId={id} />
          </Suspense>

          <Suspense fallback={<ReviewsSkeleton />}>
            <ReviewsSectionClient typeName={name} typeId={id} type="city" reviews={reviewList} />
          </Suspense>

          <Suspense fallback={<GallerySkeleton />}>
            <Gallery data={cityData} />
          </Suspense>

          <Suspense fallback={<BlogsSkeleton />}>
            <Blogs tag="Popular Blogs" />
          </Suspense>

          <Suspense fallback={<FAQSkeleton />}>
            <FAQ data={cityData} />
          </Suspense>

        </div>

        <div className="sticky top-28 self-start lg:col-span-2 xl:col-span-1 hidden lg:flex lg:flex-col lg:gap-2">
          <Suspense fallback={<RatingCardSkeleton />}>
            <PriceTrendClient data={reviewData || {}} trendData={trends as any} type={"city"} typeId={id} />
          </Suspense>
          <Suspense fallback={<TopPropertySkeleton />}>
            <TopProperty typeId={id} type={"city"} />
          </Suspense>
        </div>
        
      </div>
    </>
  );
}

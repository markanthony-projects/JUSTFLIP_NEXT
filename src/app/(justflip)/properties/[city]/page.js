import Breadcrumb from "@/src/components/organisms/breadCrumb";
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

const BuildersSection = dynamic(() => import("../../components/CityComponent/BuilderSection"), { suspense: true });
const TopProperty = dynamic(() => import("../../components/TopProperty"), { suspense: true });
const PriceTrendClient = dynamic(() => import("../../components/PriceTrendClient"), { suspense: true });
const ReviewsSectionClient = dynamic(() => import("../../components/CityComponent/ReviewsSectionClient"), { suspense: true });
const Highlight = dynamic(() => import("../../components/Highlight"), { suspense: true });
const Blogs = dynamic(() => import("../../components/Blogs"), { suspense: true });
const Gallery = dynamic(() => import("../../components/CityComponent/gallery"), { suspense: true },);
const PropertySupply = dynamic(() => import("../../components/PropertySupply"), { suspense: true });
const FAQ = dynamic(() => import("../../components/FAQ"), { suspense: true });
import { constructMetadata } from "@/src/utils/seo";
import { buildBreadcrumbSchema } from "@/src/utils/schema";

export async function generateMetadata({ params }) {
  const { city } = await params;
  const { name, id } = parseCityUrl(city);
  const { cityData } = await getCityPageData(id);

  const title = `New Projects & Properties in ${name} | Real Estate | Justflip`;
  const description = cityData?.description ? cityData.description.replace(/<[^>]+>/g, '').substring(0, 160) : `Explore the latest residential properties, apartments, and villas in ${name}.`;

  return constructMetadata({
    title,
    description,
    canonical: `/properties/${city}`
  });
}

export const revalidate = 3600;

export default async function CityPage({ params }) {
  const { city } = await params;
  const { name, id } = parseCityUrl(city);
  const { cityData, builders, reviewData, reviewList, trends, } = await getCityPageData(id);
  const breadcrumbItems = [{ label: "Properties", href: "/properties" }, { label: name }];
  const bannerImage = cityData?.medias?.find(o => o.title === 'logo');

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
          <HeaderTop data={cityData} bannerImage={bannerImage} />
          <div className="block lg:hidden">
            <Suspense fallback={<TopPropertySkeleton />}>
              <TopProperty typeId={id} type={"city"} />
            </Suspense>
            <Suspense fallback={<RatingCardSkeleton />}>
              <PriceTrendClient data={reviewData} trendData={trends} type={"city"} typeId={id} />
            </Suspense>
          </div>

          <Suspense fallback={<HighlightSkeleton />}>
            <Highlight data={cityData} />
          </Suspense>

          <Suspense fallback={<TopBuildersSkeleton />}>
            <BuildersSection builders={builders} />
          </Suspense>

          <Suspense fallback={<PropertySupplySkeleton />}>
            <PropertySupply type="city" data={cityData} />
          </Suspense>

          <Suspense fallback={<ReviewsSkeleton />}>
            <ReviewsSectionClient typeName={name} typeId={id} type="city" reviews={reviewList} />
          </Suspense>

          <Suspense fallback={<BlogsSkeleton />}>
            <Blogs tag="Popular Blogs" />
          </Suspense>

          <Suspense fallback={<GallerySkeleton />}>
            <Gallery data={cityData} />
          </Suspense>
          <Suspense fallback={<FAQSkeleton />}>
            <FAQ data={cityData} />
          </Suspense>

        </div>
        <div className="lg:col-span-2 xl:col-span-1 md:m-2 hidden lg:flex lg:flex-col lg:gap-4">
          <Suspense fallback={<RatingCardSkeleton />}>
            <PriceTrendClient data={reviewData} trendData={trends} type={"city"} typeId={id} />
          </Suspense>
          <Suspense fallback={<TopPropertySkeleton />}>
            <TopProperty typeId={id} type={"city"} />
          </Suspense>

        </div>
      </div>
    </div>
  );
}

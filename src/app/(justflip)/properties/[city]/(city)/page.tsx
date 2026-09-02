import Breadcrumb from "@/src/components/organisms/breadCrumb";
import { notFound } from 'next/navigation';
import { parseCityUrl } from "@/src/utils/url";
import { getCityPageData } from "@/src/app/(justflip)/components/CityComponent/city.server";
import HeaderTop from "@/src/app/(justflip)/components/HeaderTop";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { HighlightSkeleton } from "@/src/app/(justflip)/components/Skelton/HighlightSkeleton";
import { TopBuildersSkeleton } from "@/src/app/(justflip)/components/Skelton/TopBuildersSkeleton";
import { PropertySupplySkeleton } from "@/src/app/(justflip)/components/Skelton/PropertySupplySkeleton";
import { ReviewsSkeleton } from "@/src/app/(justflip)/components/Skelton/ReviewsSkeleton";
import { BlogsSkeleton } from "@/src/app/(justflip)/components/Skelton/BlogsSkelton";
import { GallerySkeleton } from "@/src/app/(justflip)/components/Skelton/GallerySkeleton";
import { FAQSkeleton } from "@/src/app/(justflip)/components/Skelton/FAQSkeleton";
import { RatingCardSkeleton } from "@/src/app/(justflip)/components/Skelton/RatingCardSkeleton";
import { TopPropertySkeleton } from "@/src/app/(justflip)/components/Skelton/TopPropertySkeleton";

const BuildersSection = dynamic(() => import("@/src/app/(justflip)/components/CityComponent/BuilderSection"));
const TopProperty = dynamic(() => import("@/src/app/(justflip)/components/TopProperty"));
const PriceTrendClient = dynamic(() => import("@/src/app/(justflip)/components/PriceTrendClient"));
const ReviewsSectionClient = dynamic(() => import("@/src/app/(justflip)/components/CityComponent/ReviewsSectionClient"));
const Highlight = dynamic(() => import("@/src/app/(justflip)/components/Highlight"));
const Blogs = dynamic(() => import("@/src/app/(justflip)/components/Blogs"));
const PropertyGallery = dynamic(() => import("@/src/app/(justflip)/components/PropertyGallery"));
const PropertySupply = dynamic(() => import("@/src/app/(justflip)/components/PropertySupply"));
const FAQ = dynamic(() => import("@/src/app/(justflip)/components/FAQ"));
import { constructMetadata } from "@/src/utils/seo";
import { Metadata } from 'next';
import ScrollToTop from "@/src/components/atoms/ScrollToTop";
import PropertyDetailNavTabs from "@/src/app/(justflip)/components/PropertyDetailsNavTabs";

const cityNavItems = [
  { id: "overview", label: "Overview" },
  { id: "properties", label: "Explore More Properties"},
  { id: "highlights", label: "City Highlights" },
  { id: "builders", label: "Top Builders" },
  { id: "reviews", label: "Reviews" },
  { id: "gallery", label: "Gallery" },
  { id: "blogs", label: "Blogs" },
  { id: "faq", label: "Frequently Asked Questions" },
];


type CityPageProps = {
  params: Promise<{ city: string }>;
};

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { city } = await params;
  const { name, id } = parseCityUrl(city);
  let cityData: any = null;
  try {
    const data = await getCityPageData(id);
    cityData = data?.cityData || null;
  } catch {
    cityData = null;
  }

  const title = `2/3/4 BHK Flats, Villas & Plots in ${name || 'City'} - Prices, Photos | JustFlip`;
  const description = cityData?.description?.trim()
    ? cityData.description.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().substring(0, 157) + '...'
    : `Browse 500+ verified properties, apartments, and villas for sale in ${name || 'City'}. View photos, floor plans, and price trends. Find your dream home today!`.substring(0, 160);

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

  const data = await getCityPageData(id);

  if (!data || !data.cityData) {
    return notFound();
  }

  const { cityData, builders, reviewData, reviewList, trends } = data;
  const breadcrumbItems = [{ label: "Properties", href: "/properties" }, { label: name }];
  const bannerImage = cityData?.medias?.find((o: any) => o.title === 'logo');

  return (
    <div className="w-full px-2 md:px-4">
      <ScrollToTop />
      <Breadcrumb items={breadcrumbItems} />

      <PropertyDetailNavTabs navItems={cityNavItems} scrollThreshold={100} showArrows={false}/>

      <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-4 gap-6 mx-auto">
        {/* Left Column: Stack of individual, clean tile cards */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-4 md:space-y-6">

          {/* 1. Header / City Overview */}
          <div id="overview">
            <HeaderTop data={cityData} bannerImage={bannerImage} />
          </div>

          {/* Mobile Sidebar Cards (Price Trends & Top Properties) */}
          <div className="block lg:hidden space-y-4">
            <Suspense fallback={<RatingCardSkeleton />}>
              <PriceTrendClient data={reviewData || {}} trendData={trends as any} type={"city"} typeId={id} />
            </Suspense>
            <Suspense fallback={<TopPropertySkeleton />}>
              <TopProperty typeId={id} type={"city"} />
            </Suspense>
          </div>

          {/* 2. Explore Properties by Category & Price Filter */}
          <Suspense fallback={<PropertySupplySkeleton />}>
            <div id="properties">
              <PropertySupply type="city" data={cityData as any} typeName={name} typeId={id} />
            </div>
          </Suspense>

          {/* 3. City Highlights Tile (What Stands Out & What Goes Unnoticed) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
            <Suspense fallback={<HighlightSkeleton />}>
              <div id="highlights">
                <Highlight data={cityData} />
              </div>
            </Suspense>
          </div>

          {/* 4. Top Builders & Developers Tile */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
            <Suspense fallback={<TopBuildersSkeleton />}>
              <div id="builders">
                <BuildersSection builders={builders} city={cityData} />
              </div>
            </Suspense>
          </div>

          {/* 5. Ratings & Reviews Tile */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
            <Suspense fallback={<ReviewsSkeleton />}>
              <div id="reviews">
                <ReviewsSectionClient typeName={name} typeId={id} type="city" reviews={reviewList} />
              </div>
            </Suspense>
          </div>

          {/* 6. City Photo Gallery */}
          <Suspense fallback={<GallerySkeleton />}>
            <div id="gallery">
              <PropertyGallery data={cityData} title={`${name} - At a Glance`} />
            </div>
          </Suspense>

        </div>

        {/* Right Column: Sticky Sidebar fixed on the right */}
        <div className="sticky top-28 self-start lg:col-span-2 xl:col-span-1 hidden lg:flex lg:flex-col lg:gap-4">
          <Suspense fallback={<RatingCardSkeleton />}>
            <PriceTrendClient data={reviewData || {}} trendData={trends as any} type={"city"} typeId={id} />
          </Suspense>
          <Suspense fallback={<TopPropertySkeleton />}>
            <TopProperty typeId={id} type={"city"} />
          </Suspense>
        </div>

      </div>

      {/* Full-Width Centered Sections Below Grid */}
      <div className="w-full space-y-8 my-8">
        <Suspense fallback={<BlogsSkeleton />}>
          <div id="blogs">
            <Blogs tag="Popular Blogs" />
          </div>
        </Suspense>

        <Suspense fallback={<FAQSkeleton />}>
          <div id="faq">
            <FAQ data={cityData} />
          </div>
        </Suspense>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import Image from "@/src/components/atoms/Image";
import { createProjectUrl } from "@/src/utils/url";
import Link from "next/link";
import { FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';
import { FiShare2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import FavouriteButton from "@/src/components/atoms/FavouriteButton";
import { Project } from "@/src/types";
import { toast } from '@/src/utils/toast';
import LoginModal from '@/src/components/organisms/LoginModal';

interface SearchResultCardProps {
  project: Project;
  priority?: boolean;
}

const SearchResultCard = ({ project, priority }: SearchResultCardProps) => {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageHovered, setIsImageHovered] = useState(false);

  if (!project) return null;

  const locationName = project?.location?.name || "";
  const cityName = project?.city?.name || "";
  const zoneName = project?.zone?.name || project?.location?.zone?.name || "";
  const projectName = project?.name || "";

  const projectUrl = createProjectUrl(
    cityName,
    zoneName,
    locationName,
    projectName,
    project?.id
  );

  const bannerImage = project?.banner || (project?.medias?.find(m => m.title === 'banner') || project?.medias?.[0]);
  const logoImage = project?.medias?.find(m => m.title === 'logo');

  // Prepare images for carousel (ensure no duplicates if banner is already in medias)
  const carouselImages = React.useMemo(() => {
    let imgs = project?.medias?.filter(m => m.url && m.title !== 'logo') || [];
    if (imgs.length === 0 && bannerImage) {
      imgs = [bannerImage];
    }
    // Limit to first 5 images for performance and UX
    return imgs.slice(0, 5);
  }, [project?.medias, bannerImage]);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
  };

  // Calculate pricing
  const minPrice = project.minPrice || Math.min(...(project.units?.map(u => u.minPrice) || [0]));
  const maxPrice = project.maxPrice || Math.max(...(project.units?.map(u => u.maxPrice) || [0]));

  const formatPrice = (val: number | null | undefined) => {
    if (!val || val === Infinity || val === -Infinity) return 'On Request';
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val}`;
  };

  let priceDisplay = 'On Request';
  if (minPrice && maxPrice && minPrice !== maxPrice && minPrice !== Infinity) {
    priceDisplay = `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
  } else if (minPrice && minPrice !== Infinity) {
    priceDisplay = formatPrice(minPrice);
  }

  // Unit types
  const unitTypes = Array.from(new Set(project.units?.map(u => u.type) || [])).join(', ');

  // Possession Date
  const possessionDateStr = project.possessionDate ? new Date(project.possessionDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Ready to Move';

  const tags = project.tags ? project.tags.split(',')[0] : 'Featured Properties';

  const handleCall = () => {
    window.location.href = 'tel:+918431362126'
  }

  const handleWhatsapp = () => {
    const locationText = [locationName, cityName].filter(Boolean).join(', ');

    const message = `Hi, I am interested in "${projectName}"${locationText ? ` in ${locationText}` : ''}. Please share more details.`;
    const encodedMessage = encodeURIComponent(message);

    window.open(
      `https://wa.me/918431362126?text=${encodedMessage}`,
      '_blank'
    );
  };

  const handleShare = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    const fullUrl = `${window.location.origin}${projectUrl}`;

    try {
      await navigator.clipboard.writeText(fullUrl);
      toast.success("Property link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300 mb-4 flex flex-col md:flex-row group">

      {/* Left Image Section */}
      <div
        className="relative w-full md:w-[35%] lg:w-[30%] h-[200px] sm:h-[220px] md:h-auto shrink-0 bg-gray-100 group/image"
        onMouseEnter={() => setIsImageHovered(true)}
        onMouseLeave={() => setIsImageHovered(false)}
      >
        <Link href={projectUrl} className="block w-full h-full relative overflow-hidden">
          <div
            className="flex w-full h-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {carouselImages.length > 0 ? (
              carouselImages.map((img, idx) => (
                <div key={idx} className="w-full h-full shrink-0 relative">
                  <Image
                    src={img.url}
                    alt={img.alt || projectName}
                    className="w-full h-full object-cover group-hover/image:scale-105 transition-transform duration-700 ease-out"
                    priority={priority && idx === 0}
                  />
                </div>
              ))
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>
        </Link>

        {/* Carousel Navigation Arrows */}
        {carouselImages.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className={`absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-800 hover:scale-110 hover:bg-white transition-all z-20 ${isImageHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}
            >
              <FiChevronLeft className="w-5 h-5 -ml-0.5" />
            </button>
            <button
              onClick={handleNextImage}
              className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-800 hover:scale-110 hover:bg-white transition-all z-20 ${isImageHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}`}
            >
              <FiChevronRight className="w-5 h-5 ml-0.5" />
            </button>
          </>
        )}

        {/* Pagination Dots */}
        {carouselImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {carouselImages.map((_, idx) => (
              <div
                key={idx}
                className={`transition-all duration-300 rounded-full bg-white ${idx === currentImageIndex ? 'w-4 h-1.5 opacity-100' : 'w-1.5 h-1.5 opacity-60 hover:opacity-100'}`}
              />
            ))}
          </div>
        )}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm shadow-md text-xs font-semibold text-gray-800">
            <span className="text-orange-500">🔥</span>
            {tags}
          </span>
        </div>
        <div className="absolute top-3 right-3 z-10">
          <FavouriteButton
            project={project}
            onAuthRequired={() => setShowLoginPrompt(true)}
            className="p-2 rounded-full flex items-center justify-center bg-white/95 backdrop-blur-sm shadow-sm hover:bg-red-50 transition-colors"
          />
        </div>
      </div>

      {/* Right Content Section */}
      <div className="flex-1 p-3 sm:p-4 md:p-5 flex flex-col relative bg-white">

        {/* Top Badges & Logo */}
        <div className="flex justify-between items-start mb-0">
          {/* Title & Location */}
          <Link href={projectUrl} className="block mb-2 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-[#002B5B] transition-colors line-clamp-1">
              {projectName}
            </h2>
            <p className="text-xs sm:text-sm font-medium text-gray-600 mt-0.5 line-clamp-1">
              {locationName}, {cityName}{zoneName ? `, ${zoneName}` : ''}
            </p>
          </Link>

          {logoImage && (
            <div className="hidden sm:block w-16 h-12 relative border border-gray-100 rounded bg-white p-1 ml-4 shrink-0">
              <Image
                src={logoImage.url}
                alt={logoImage.alt || `${project.builder?.name} Logo`}
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 sm:gap-x-4 p-3 sm:p-4 rounded-xl border border-gray-100 bg-gray-50/50 mt-auto mb-3 sm:mb-4">
          <div className="flex flex-col items-start sm:items-center text-left sm:text-center sm:border-r border-gray-200 last:border-0 pr-2 sm:pr-4">
            <span className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-500 font-medium mb-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Avg Price
            </span>
            <span className="font-bold text-sm sm:text-base text-gray-900">{priceDisplay}</span>
          </div>

          <div className="flex flex-col items-start sm:items-center text-left sm:text-center sm:border-r border-gray-200 last:border-0 sm:pr-4">
            <span className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-500 font-medium mb-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Unit types
            </span>
            <span className="font-bold text-sm sm:text-base text-gray-900 line-clamp-1" title={unitTypes || 'N/A'}>
              {unitTypes || 'N/A'}
            </span>
          </div>

          <div className="flex flex-col col-span-2 sm:col-span-1 items-start sm:items-center text-left sm:text-center last:border-0 pt-0 sm:pt-0">
            <span className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-500 font-medium mb-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Possession Date
            </span>
            <span className="font-bold text-sm sm:text-base text-gray-900">{possessionDateStr}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex gap-2">
            <button className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg border border-gray-200 text-green-600 hover:bg-green-50 hover:border-green-300 hover:shadow-sm active:scale-90 transition-all duration-200 group/btn">
              <FaWhatsapp className="text-base sm:text-lg group-hover/btn:scale-110 transition-transform" />
            </button>
            <button className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg border border-gray-200 text-[#002B5B] hover:bg-blue-50 hover:border-blue-300 hover:shadow-sm active:scale-90 transition-all duration-200 group/btn">
              <FiShare2 className="text-base sm:text-lg group-hover/btn:scale-110 transition-transform" />
            </button>
            <button className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg border border-gray-200 text-[#002B5B] hover:bg-blue-50 hover:border-blue-300 hover:shadow-sm active:scale-90 transition-all duration-200 group/btn">
              <FaPhoneAlt className="text-base sm:text-lg group-hover/btn:scale-110 transition-transform" />
            </button>
          </div>

          <Link
            href={projectUrl}
            className="px-4 sm:px-6 py-2 sm:py-2.5 bg-[#002B5B] text-white font-semibold rounded-lg hover:bg-[#001f42] hover:shadow-md hover:shadow-blue-900/20 active:scale-95 transition-all text-xs sm:text-sm group-hover:bg-[#001f42] relative overflow-hidden flex items-center"
          >
            Get more info
          </Link>
        </div>

      </div>
      <LoginModal
        isOpen={showLoginPrompt}
        closeModal={() => setShowLoginPrompt(false)}
      />
    </div>
  );
};

export default SearchResultCard;

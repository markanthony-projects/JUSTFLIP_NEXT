'use client';

import React, { useState, useMemo } from 'react';
import Image from "@/src/components/atoms/Image";
import { createProjectUrl } from "@/src/utils/url";
import Link from "next/link";
import { FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';
import { FiShare2, FiChevronLeft, FiChevronRight, FiHome, FiMapPin, FiCheckCircle, FiCopy, FiX, FiMap } from 'react-icons/fi';
import { MdLocationOn } from 'react-icons/md';
import FavouriteButton from "@/src/components/atoms/FavouriteButton";
import { Project } from "@/src/types";
import { toast } from '@/src/utils/toast';
import dynamic from 'next/dynamic';

const LoginModal = dynamic(() => import('@/src/components/organisms/LoginModal'), { ssr: false });
const CommuteExplorerModal = dynamic(() => import('@/src/app/(justflip)/components/Project/Map/CommuteExplorerModal'), { ssr: false });

interface SearchResultCardProps {
  project: Project;
  priority?: boolean;
}

const SearchResultCard = ({ project, priority }: SearchResultCardProps) => {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showReraPopup, setShowReraPopup] = useState(false);
  const [reraCopied, setReraCopied] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  if (!project) return null;

  const locationName = project?.location?.name || "";
  const cityName = project?.city?.name || "";
  const zoneName = project?.zone?.name || project?.location?.zone?.name || "";
  const projectName = project?.name || "Property";
  const propertyType = project?.type || project?.residenceType || "Property";
  const builderName = project?.builder?.name || "";

  const projectUrl = createProjectUrl(
    cityName,
    zoneName,
    locationName,
    projectName,
    project?.id
  );

  const bannerImage = project?.banner || (project?.medias?.find(m => m.title === 'banner') || project?.medias?.[0]);
  const logoImage = project?.medias?.find(m => m.title === 'logo');

  // Prepare images for carousel
  const carouselImages = useMemo(() => {
    let imgs = project?.medias?.filter(m => m.url && m.title !== 'logo' && m.type !== 'video') || [];
    if (imgs.length === 0 && bannerImage?.url) {
      imgs = [bannerImage];
    }
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

  const handleReraClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowReraPopup((prev) => !prev);
  };

  const handleCopyRera = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const reraVal = project?.rera || (project as any)?.reraNumber || (project as any)?.reraNo;
    if (reraVal) {
      navigator.clipboard.writeText(reraVal);
      setReraCopied(true);
      toast.success("RERA ID copied to clipboard!");
      setTimeout(() => setReraCopied(false), 2000);
    }
  };

  // Pricing calculation
  const minPrice = project.minPrice || Math.min(...(project.units?.map(u => u.minPrice) || [0]));
  const maxPrice = project.maxPrice || Math.max(...(project.units?.map(u => u.maxPrice) || [0]));

  const formatPrice = (val: number | null | undefined) => {
    if (!val || val === Infinity || val === -Infinity) return 'On Request';
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val}`;
  };

  let priceDisplay = 'Price on Request';
  if (minPrice && maxPrice && minPrice !== maxPrice && minPrice !== Infinity) {
    priceDisplay = `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
  } else if (minPrice && minPrice !== Infinity) {
    priceDisplay = formatPrice(minPrice);
  }

  // Unit types
  const unitTypes = Array.from(new Set(project.units?.map(u => u.type) || [])).filter(Boolean).join(', ');

  // Possession Date
  const possessionDateStr = project.possessionDate
    ? new Date(project.possessionDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Ready to Move';

  const handleCall = () => {
    window.location.href = 'tel:+918431362126';
  };

  const handleWhatsapp = () => {
    const locationText = [locationName, cityName].filter(Boolean).join(', ');
    const message = `Hi, I am interested in "${projectName}"${locationText ? ` in ${locationText}` : ''}. Please share more details.`;
    window.open(`https://wa.me/918431362126?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleShare = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const fullUrl = `${window.location.origin}${projectUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: projectName,
          text: `Check out ${projectName} on JustFlip`,
          url: fullUrl,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(fullUrl);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <article className="w-full bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:border-slate-300 hover:shadow-md transition-all duration-200 mb-3.5 sm:mb-4 flex flex-col md:flex-row group">
      {/* Left Image Carousel */}
      <div className="relative w-full md:w-[35%] lg:w-[32%] h-[190px] sm:h-[220px] md:h-auto min-h-[190px] md:min-h-[220px] shrink-0 bg-slate-100 overflow-hidden">
        <Link href={projectUrl} className="block w-full h-full relative overflow-hidden" aria-label={`View details for ${projectName}`}>
          {carouselImages.length > 0 ? (
            <div className="w-full h-full relative">
              <Image
                src={carouselImages[currentImageIndex]?.url}
                alt={carouselImages[currentImageIndex]?.alt || projectName}
                className="w-full h-full object-cover"
                priority={priority && currentImageIndex === 0}
                sizes="(max-width: 768px) 100vw, 360px"
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-medium">
              No Image Available
            </div>
          )}
        </Link>

        {/* RERA Badge on Photo - Only shown when RERA number is available */}
        {(() => {
          const reraNumber = project?.rera && typeof project.rera === 'string' && project.rera.trim().length > 0
            ? project.rera.trim()
            : null;

          if (!reraNumber) return null;

          return (
            <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-20 max-w-[85%]">
              {showReraPopup ? (
                <div
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#002B5B]/95 backdrop-blur-md shadow-md text-white text-[10px] sm:text-[11px] font-mono font-medium animate-in fade-in zoom-in-95 duration-150 border border-white/20"
                >
                  <FiCheckCircle className="text-emerald-400 w-3.5 h-3.5 shrink-0" />
                  <span className="truncate max-w-[130px] xs:max-w-[170px] sm:max-w-[220px] select-all font-sans font-semibold">
                    RERA: {reraNumber}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyRera}
                    title="Copy RERA Number"
                    className="text-emerald-400 hover:text-white p-0.5 rounded cursor-pointer shrink-0 transition-colors"
                  >
                    <FiCopy className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowReraPopup(false); }}
                    className="text-slate-300 hover:text-white p-0.5 rounded cursor-pointer shrink-0 ml-0.5 transition-colors"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleReraClick}
                  title="Click to view RERA Number"
                  className="flex items-center gap-1 px-2.5 py-0.5 sm:py-1 rounded-full bg-white/95 backdrop-blur-md shadow-xs text-[10px] sm:text-[11px] font-bold text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors cursor-pointer border border-emerald-100/80 capitalize"
                >
                  <FiCheckCircle className="text-emerald-600 w-3 h-3" />
                  <span>RERA</span>
                </button>
              )}
            </div>
          );
        })()}

        {/* Favorite Button */}
        <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10">
          <FavouriteButton
            project={project}
            onAuthRequired={() => setShowLoginPrompt(true)}
            className="p-1.5 sm:p-2 rounded-full flex items-center justify-center bg-white/95 backdrop-blur-md shadow-xs hover:bg-rose-50 transition-colors"
          />
        </div>

        {/* Navigation Arrows */}
        {carouselImages.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-slate-800 hover:bg-white transition-colors z-10"
            >
              <FiChevronLeft className="w-4 h-4 -ml-0.5" />
            </button>
            <button
              onClick={handleNextImage}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-slate-800 hover:bg-white transition-colors z-10"
            >
              <FiChevronRight className="w-4 h-4 ml-0.5" />
            </button>

            {/* Photo Counter Pill */}
            <div className="absolute bottom-2.5 right-2.5 z-10 px-1.5 sm:px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-semibold tracking-wide">
              {currentImageIndex + 1} / {carouselImages.length}
            </div>
          </>
        )}
      </div>

      {/* Right Content Section */}
      <div className="flex-1 p-3 sm:p-4 md:p-5 flex flex-col justify-between bg-white">
        {/* Header: Title, Builder, Location, and Property Type */}
        <div>
          <div className="flex justify-between items-start gap-2 sm:gap-3">
            <div className="min-w-0 flex-1">
              <Link href={projectUrl} className="group-hover:text-[#002B5B] transition-colors block">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug truncate">
                  {projectName}
                </h2>
              </Link>

              {builderName && (
                <p className="text-[11px] sm:text-xs font-semibold text-slate-500 mt-0.5 truncate">
                  By <span className="text-slate-700">{builderName}</span>
                </p>
              )}

              <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5 sm:mt-1 flex items-center gap-1 truncate">
                <FiMapPin className="text-rose-500 shrink-0 w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="truncate">{locationName}{cityName ? `, ${cityName}` : ''}{zoneName ? ` (${zoneName})` : ''}</span>
              </p>
            </div>

            {/* See on Map Trigger in Top-Right Corner */}
            <div className="shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowMapModal(true);
                }}
                className="inline-flex items-center gap-1.5 sm:gap-2 group/map cursor-pointer transition-colors"
                title="See on Map"
              >
                {/* Mini Map Thumbnail */}
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-slate-200/90 overflow-hidden relative shadow-2xs shrink-0 flex items-center justify-center bg-[#E5E3DF]">
                  {/* Subtle map road lines pattern */}
                  <div className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:6px_6px]" />
                  <div className="absolute w-full h-1 bg-amber-200/60 rotate-45 top-2.5" />
                  <div className="absolute w-full h-1 bg-blue-200/60 -rotate-12 bottom-2" />
                  <MdLocationOn className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 relative z-10 drop-shadow-xs group-hover/map:scale-110 transition-transform duration-150" />
                </div>

                {/* Underlined See on Map Label */}
                <span className="text-xs sm:text-sm font-semibold text-slate-800 group-hover/map:text-[#002B5B] underline underline-offset-3 decoration-slate-400 group-hover/map:decoration-[#002B5B] transition-colors">
                  See on Map
                </span>
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-xl bg-slate-50 border border-slate-100 my-2.5 sm:my-3.5">
            <div className="flex flex-col border-r border-slate-200/80 pr-1.5 sm:pr-2">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-400">Price</span>
              <span className="font-extrabold text-xs sm:text-sm text-[#002B5B] truncate mt-0.5">
                {priceDisplay}
              </span>
            </div>

            <div className="flex flex-col border-r border-slate-200/80 px-1.5 sm:px-2">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-400">Config</span>
              <span className="font-bold text-xs sm:text-sm text-slate-800 truncate mt-0.5" title={unitTypes || 'N/A'}>
                {unitTypes || 'Residential'}
              </span>
            </div>

            <div className="flex flex-col pl-1.5 sm:pl-2">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-400">Possession</span>
              <span className="font-bold text-xs sm:text-sm text-emerald-700 truncate mt-0.5">
                {possessionDateStr}
              </span>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              onClick={handleWhatsapp}
              title="Chat on WhatsApp"
              aria-label="Chat on WhatsApp"
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg border border-slate-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 transition-colors cursor-pointer"
            >
              <FaWhatsapp className="text-sm sm:text-base" />
            </button>
            <button
              onClick={handleShare}
              title="Share property"
              aria-label="Share property"
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <FiShare2 className="text-xs sm:text-sm" />
            </button>
            <button
              onClick={handleCall}
              title="Call for inquiry"
              aria-label="Call for inquiry"
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg border border-slate-200 text-[#002B5B] hover:bg-blue-50 hover:border-blue-200 transition-colors cursor-pointer"
            >
              <FaPhoneAlt className="text-[11px] sm:text-xs" />
            </button>
          </div>

          <Link
            href={projectUrl}
            className="px-3.5 sm:px-5 py-1.5 sm:py-2 bg-[#002B5B] text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-[#001f42] transition-colors cursor-pointer text-center inline-flex items-center justify-center shrink-0"
          >
            View Details
          </Link>
        </div>
      </div>

      <LoginModal
        isOpen={showLoginPrompt}
        closeModal={() => setShowLoginPrompt(false)}
      />

      {showMapModal && (
        <CommuteExplorerModal
          project={project}
          onClose={() => setShowMapModal(false)}
        />
      )}
    </article>
  );
};

export default SearchResultCard;

import React, { useState } from 'react';
import Image from "@/src/components/atoms/Image";
import { createProjectUrl } from "@/src/utils/url";
import Link from "next/link";
import { FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';
import { FiShare2 } from 'react-icons/fi';
import FavouriteButton from "@/src/components/atoms/FavouriteButton";

const SearchResultCard = ({ project, priority }) => {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

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

  // Calculate pricing
  const minPrice = project.minPrice || Math.min(...(project.units?.map(u => u.minPrice) || [0]));
  const maxPrice = project.maxPrice || Math.max(...(project.units?.map(u => u.maxPrice) || [0]));
  
  const formatPrice = (val) => {
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
  const unitTypes = [...new Set(project.units?.map(u => u.type) || [])].join(', ');

  // Possession Date
  const possessionDateStr = project.possessionDate ? new Date(project.possessionDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Ready to Move';

  const tags = project.tags ? project.tags.split(',')[0] : 'Featured Properties';

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300 mb-4 flex flex-col md:flex-row group">
      
      {/* Left Image Section */}
      <div className="relative w-full md:w-[35%] lg:w-[30%] h-[250px] md:h-auto shrink-0 bg-gray-100">
        <Link href={projectUrl} className="block w-full h-full">
          <Image
            src={bannerImage?.url}
            alt={bannerImage?.alt || projectName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            priority={priority}
          />
        </Link>
        <div className="absolute top-3 right-3 z-10">
          <FavouriteButton
            project={project}
            onAuthRequired={() => setShowLoginPrompt(true)}
            className="p-2 rounded-full flex items-center justify-center bg-white/95 backdrop-blur-sm shadow-sm hover:bg-red-50 transition-colors"
          />
        </div>
      </div>

      {/* Right Content Section */}
      <div className="flex-1 p-4 md:p-5 flex flex-col relative bg-white">
        
        {/* Top Badges & Logo */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-300 rounded-full text-xs font-semibold text-gray-700">
              <span className="text-orange-500 text-[10px]">🔥</span>
              {tags}
            </span>

          </div>
          
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

        {/* Title & Location */}
        <Link href={projectUrl} className="block mb-4">
          <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#002B5B] transition-colors line-clamp-1">
            {projectName}
          </h2>
          <p className="text-sm font-medium text-gray-600 mt-0.5 line-clamp-1">
            {locationName}, {cityName}{zoneName ? `, ${zoneName}` : ''}
          </p>
        </Link>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-3 sm:gap-x-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50 mt-auto mb-4">
          <div className="flex flex-col sm:items-center text-left sm:text-center sm:border-r border-gray-200 last:border-0 sm:pr-4">
            <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mb-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Avg Price
            </span>
            <span className="font-bold text-gray-900">{priceDisplay}</span>
          </div>

          <div className="flex flex-col sm:items-center text-left sm:text-center sm:border-r border-gray-200 last:border-0 sm:pr-4">
            <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mb-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Unit types
            </span>
            <span className="font-bold text-gray-900 line-clamp-1" title={unitTypes || 'N/A'}>
              {unitTypes || 'N/A'}
            </span>
          </div>

          <div className="flex flex-col sm:items-center text-left sm:text-center last:border-0">
            <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mb-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Possession Date
            </span>
            <span className="font-bold text-gray-900">{possessionDateStr}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 text-green-600 hover:bg-green-50 hover:border-green-200 transition-colors">
              <FaWhatsapp className="text-lg" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 text-[#002B5B] hover:bg-blue-50 hover:border-blue-200 transition-colors">
              <FiShare2 className="text-lg" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 text-[#002B5B] hover:bg-blue-50 hover:border-blue-200 transition-colors">
              <FaPhoneAlt className="text-lg" />
            </button>
          </div>
          
          <Link 
            href={projectUrl}
            className="px-6 py-2.5 bg-[#002B5B] text-white font-semibold rounded-lg hover:bg-[#001f42] transition-colors text-sm"
          >
            Get more info
          </Link>
        </div>

      </div>
    </div>
  );
};

export default SearchResultCard;

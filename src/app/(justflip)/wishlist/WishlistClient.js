"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from "react-hot-toast";
import { convertToCurrency, getLowestAndHighestPrice } from "@/src/utils/RenderFunction";
import { HiXMark } from "react-icons/hi2";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { AiOutlinePlus, AiOutlineHeart } from "react-icons/ai";
import Breadcrumb from '@/src/components/organisms/breadCrumb';
import { useAuthStore } from '@/src/stores/auth.store';
import { useFavouritesStore } from '@/src/stores/favourites.store';
import { useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const Wishlist = ({ isEmbedded = false }) => {
  const router = useRouter();
  const { user, isAuthenticated, hydrated } = useAuthStore();
  const { dataList, fetchFavouriteData, modifyFavourite, loading } = useFavouritesStore();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [datas, setDatas] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      toast.error("Please login to view your wishlist.");
      router.push("/"); // Redirecting to home or login page
    }
  }, [hydrated, isAuthenticated, router]);

  const handleFavoriteSave = async (propertyId, item = 'project') => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    try {
      await modifyFavourite({ action: "remove", id: propertyId });
      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error("Failed to remove from wishlist");
    }
  }

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchFavouriteData();
  }, [isAuthenticated, fetchFavouriteData]);

  // Sync zustand store data to our local paginated view
  useEffect(() => {
    if (dataList?.length > 0) {
       setDatas(dataList);
       setHasMore(false);
    } else {
       setDatas([]);
    }
  }, [dataList]);

  if (!hydrated || !isAuthenticated) {
    return (
      <div className='flex justify-center h-screen overflow-hidden items-center w-full'>
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#002B5B]"></div>
          <p className="text-[#002B5B] font-medium mt-4 animate-pulse">Checking authentication...</p>
        </div>
      </div>
    );
  }

  const sentinelRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const breadcrumbItems = [
    {
      label: "Wishlist",
      to: "/wishlist"
    },
  ];

  return (
    <div className={isEmbedded ? 'p-4 md:p-5 w-full h-full' : 'px-4 md:px-8 xl:px-14 lg:px-12 w-full 2xl:max-w-[1540px] mx-auto overflow-x-hidden pt-[10px] pb-10'}>
      {!isEmbedded && <Breadcrumb items={breadcrumbItems} showPrevious={true} />}

      <div className={`${isEmbedded ? 'mt-0 mb-6' : 'mt-8 mb-8'} flex justify-between items-end border-b border-gray-200 pb-4`}>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#002B5B] tracking-tight">My Wishlist</h1>
          <p className="text-gray-500 text-sm mt-2">Manage your favorite properties and projects in one place.</p>
        </div>
        <div className="bg-[#E6EEF2] px-4 py-2 rounded-full hidden sm:block">
          <p className="text-[#002B5B] font-semibold text-sm">{datas?.length || 0} Saved Properties</p>
        </div>
      </div>

      <div className='mt-5'>
        {datas?.length > 0 &&
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 h-auto min-h-[50vh]">
            {datas?.map((property, index) => {
              const { minPrice, maxPrice } = getLowestAndHighestPrice(property?.units);
              const bannerUrl = property?.medias?.find(media => media.title === "banner")?.url || property?.bannerImage;
              const logoUrl = property?.medias?.find(media => media?.title === "logo")?.url || property?.logoImage;

              return (
                <Link href={`/properties/${property?.city?.name}/${property?.zone?.name}/${property?.location?.name}/${property?.slug || property?.name}/${property?.id}`} key={property?.id}>
                  <div className="group relative rounded-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-2xl bg-white border border-gray-100 flex flex-col overflow-hidden h-full">
                    
                    {/* Image Area */}
                    <div className="relative w-full h-[15rem] bg-gray-100 shrink-0 overflow-hidden">
                      {bannerUrl && (
                        <img
                          src={bannerUrl}
                          alt={property?.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                          loading="eager"
                          fetchPriority="high"
                        />
                      )}
                      
                      {/* Gradient Overlay for better text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
                      
                      {/* Logo (Top Left) */}
                      {logoUrl && (
                        <div className="absolute top-4 left-4 bg-white p-1.5 rounded-xl shadow-md z-10 transform transition-transform duration-300 group-hover:scale-105">
                          <img
                            src={logoUrl}
                            alt={property?.name}
                            loading="eager"
                            fetchPriority="high"
                            className="w-9 h-9 object-contain rounded-lg"
                          />
                        </div>
                      )}
                      
                      {/* Close Button (Top Right) */}
                      {isAuthenticated && (
                        <button
                          type="button"
                          aria-label="Remove from wishlist"
                          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-red-50 hover:text-red-600 p-2 rounded-full shadow-md text-gray-600 transition-all duration-300 z-10 opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleFavoriteSave(property?.id, property?.item);
                          }}
                        >
                          <HiXMark size={18} aria-hidden="true" />
                        </button>
                      )}

                      {/* Exclusive Tag (Bottom Left) */}
                      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-[#002B5B] shadow-lg z-10 transform transition-transform duration-300 group-hover:-translate-y-1">
                        Exclusive
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-5 flex flex-col flex-1 justify-between bg-white relative z-20">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-[#002B5B] transition-colors duration-300">
                          {property?.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-2">
                          <HiOutlineLocationMarker size={16} className="shrink-0 text-gray-400 group-hover:text-primary transition-colors" />
                          <p className="truncate font-medium">
                            {property?.location?.name}, {property?.city?.name}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 flex justify-between items-end">
                        <span className="inline-block bg-[#FDF5E6] text-gray-900 px-4 py-2 rounded-lg text-sm font-bold shadow-sm group-hover:bg-[#fce5c6] transition-colors duration-300">
                          &#8377; {minPrice === maxPrice ? convertToCurrency(minPrice) : `${convertToCurrency(minPrice)} - ${convertToCurrency(maxPrice)}`}
                        </span>
                        
                        {/* Decorative Arrow */}
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                           &rarr;
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
            
            {/* Add More Properties Placeholder */}
            <Link href="/" className="flex flex-col items-center justify-center border-2 border-dashed border-[#002B5B]/30 rounded-2xl min-h-[22.5rem] bg-gradient-to-b from-gray-50 to-white hover:border-[#002B5B] transition-all duration-300 group shadow-sm hover:shadow-lg">
              <div className="w-16 h-16 rounded-full bg-white border-2 border-[#002B5B]/20 group-hover:border-[#002B5B] group-hover:bg-[#002B5B] flex items-center justify-center text-[#002B5B]/40 group-hover:text-white mb-4 transition-all duration-500 transform group-hover:rotate-90 group-hover:scale-110 shadow-sm">
                <AiOutlinePlus size={28} />
              </div>
              <span className="text-[#002B5B]/70 font-semibold text-base group-hover:text-[#002B5B] transition-colors">Add more properties</span>
              <p className="text-gray-400 text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Discover new projects today</p>
            </Link>

            <div ref={sentinelRef} />
          </div>
        }

        {(!loading && datas?.length === 0) &&
          <div className='flex flex-col justify-center h-[60vh] items-center w-full bg-gray-50 rounded-3xl border border-gray-100'>
             <div className="w-24 h-24 bg-white rounded-full shadow-md flex items-center justify-center text-gray-300 mb-6">
                <AiOutlineHeart size={48} />
             </div>
             <h2 className="text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
             <p className='text-gray-500 text-base mb-8 max-w-md text-center'>Browse our collection of premium properties and save your favorites here for easy access later.</p>
             <Link href="/" className="bg-[#002B5B] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#001f42] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
                Browse Properties
             </Link>
          </div>
        }
        {loading && (
          <div className='flex justify-center h-[50vh] overflow-hidden items-center w-full'>
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#002B5B]"></div>
              <p className="text-[#002B5B] font-medium mt-4 animate-pulse">Loading your favorites...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Wishlist;

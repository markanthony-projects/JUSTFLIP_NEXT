"use client"

import Modal from '@/src/components/organisms/Modal'
import * as ProjectService from '@/src/services/ProjectService';
import { useCompareStore } from '@/src/stores/useCompare.store';
import { useFavouritesStore } from '@/src/stores/favourites.store';
import React, { useEffect, useMemo, useState } from 'react'
import CompareCarousel from '../../components/Project/CompareProject';
import Button from '@/src/components/atoms/Button';
import { FiSearch } from 'react-icons/fi';
import CompareCarouselSkeleton from '../../components/Skelton/CompareCarouselSkeleton';

function CompareModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const { items } = useCompareStore();
    const { dataList: savedData, loading: favLoading, fetchFavouriteData } = useFavouritesStore();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("Top Properties");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

    const cityId = useMemo(() => items?.[0]?.city?.id, [items]);
    const numSelected = items?.length || 0;

    const isShowingSearchResults = searchQuery.trim().length > 0;

    const filteredSavedData = useMemo(() => {
        if (!savedData) return [];
        if (!searchQuery.trim()) return savedData;
        
        const lowerQuery = searchQuery.toLowerCase();
        return savedData.filter((item) => 
            item.name?.toLowerCase().includes(lowerQuery) ||
            item.location?.name?.toLowerCase().includes(lowerQuery) ||
            item.builder?.name?.toLowerCase().includes(lowerQuery)
        );
    }, [savedData, searchQuery]);

    const displayData = activeTab === "Saved" 
        ? filteredSavedData 
        : (isShowingSearchResults ? searchResults : data);

    useEffect(() => {
        if (!isOpen || !searchQuery.trim() || activeTab === "Saved") {
            setSearchResults(null);
            return;
        }

        const timeoutId = setTimeout(async () => {
            try {
                setIsSearching(true);
                const res = await ProjectService.fetchProjectsBySearch({ search: searchQuery });
                setSearchResults(res || []);
            } catch (err) {
                console.error(err);
            } finally {
                setIsSearching(false);
            }
        }, 400);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, isOpen, activeTab]);

    useEffect(() => {
        if (!isOpen) return;

        // Fetch Wishlist Data if Saved tab is selected
        if (activeTab === "Saved") {
            fetchFavouriteData();
            return; // Don't fetch New Launches if we are on Saved tab
        }

        const controller = new AbortController();

        const fetchProjects = async () => {
            try {
                setLoading(true);

                const res = await ProjectService.fetchProjectsByTag({
                    tag: "New Launches",
                    cityId: cityId || undefined,
                    limit: 25,
                });
                
                setData(res || []);
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error(err);
                }
            } finally {
                setLoading(false);
            }
        };

        // Only fetch New Launches once if not yet fetched
        if (!data) {
            fetchProjects();
        }

        return () => controller.abort();
    }, [cityId, isOpen, activeTab, data, fetchFavouriteData]);

    return (
        <Modal isOpen={isOpen} onClose={() => onClose()} maxWidth=" md:max-w-4xl lg:max-w-[1000px]" className="bg-white/20 backdrop-blur-2xl border border-white/30 shadow-2xl rounded-3xl p-5 md:p-6">
            
            {/* Search Bar */}
            <div className="relative mb-4 mt-6">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400 text-lg" />
                </div>
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search any property" 
                    className="w-full pl-12 pr-4 py-2.5 bg-[#f2f2f2] border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl text-sm font-semibold text-gray-700 transition-all outline-none"
                />
            </div>

            {/* Header Text */}
            <div className="mb-4">
                <h2 className="text-xl md:text-2xl font-extrabold text-white mb-1">
                    {numSelected === 0 ? "Oops! No properties selected" : `Selected ${numSelected} of 3 properties`}
                </h2>
                {/* <p className="text-sm font-bold text-white">
                    Select up to 3 properties from the options below to get started.
                </p> */}
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-4">
                <button 
                    onClick={() => setActiveTab("Top Properties")}
                    className={`px-6 py-2.5 rounded-full text-sm font-bold border-2 transition-all shadow-sm ${activeTab === "Top Properties" ? "bg-[#002B5B] text-white border-[#002B5B]" : "text-[#002B5B] border-[#002B5B] hover:bg-gray-500"}`}
                >
                    Top Properties
                </button>
                <button 
                    onClick={() => setActiveTab("Saved")}
                    className={`px-6 py-2.5 rounded-full text-sm font-bold border-2 transition-all shadow-sm ${activeTab === "Saved" ? "bg-[#002B5B] text-white border-[#002B5B]" : "text-[#002B5B] border-[#002B5B] hover:bg-gray-500"}`}
                >
                    Saved
                </button>
            </div>

            {/* Carousel Section */}
            <div className="py-2 min-h-[280px]">
                {(activeTab === "Top Properties" ? (isShowingSearchResults ? isSearching : loading) : favLoading) ? (
                    <div className='w-full'>
                        <CompareCarouselSkeleton />
                    </div>
                ) : (
                    <>
                        {displayData?.length > 0 ? (
                            <CompareCarousel data={displayData} isDefault={false} />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full min-h-[250px] text-white">
                                <FiSearch size={32} className="mb-3 opacity-20" />
                                <p className="font-semibold text-sm">
                                    {isShowingSearchResults 
                                        ? `No properties found for "${searchQuery}"`
                                        : "No properties available"}
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-4 mt-4 pt-2 border-t border-white/10">
                <Button onClick={() => onClose()} className="px-8 py-2.5 rounded-xl font-bold text-[#002B5B] bg-white border-2 border-[#002B5B] hover:bg-blue-50 transition-all" >
                    Cancel
                </Button>
                <Button onClick={() => onClose()} className="px-8 py-2.5 rounded-xl font-bold text-white bg-[#002B5B] border-2 border-[#002B5B] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all" >
                    Compare
                </Button>
            </div>
        </Modal>
    );
}

export default CompareModal;
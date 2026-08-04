"use client";

import React, { useState, useEffect } from 'react';
import { HiOutlineArrowLeft, HiOutlineX } from 'react-icons/hi';
import { BiTargetLock } from 'react-icons/bi';
import { MdOutlineChevronRight } from 'react-icons/md';
import { useCityStore } from '@/src/stores/city.store';
import { RECENTLY_SEARCHED, TOP_LOCALITIES, TOP_PROJECTS } from '@/src/utils/mockLocationData';
import Image from 'next/image';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';
import { ensureCityList } from '@/src/components/NearestCity/city-list.loader';
import SiteService from '@/src/services/SiteService';

export default function LocationSelectorModal({ onClose, selectedLocalities, toggleLocality }) {
    const { activeCity, setActiveCity, cityList } = useCityStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [showAllLocalities, setShowAllLocalities] = useState(false);
    const [popularCities, setPopularCities] = useState([]);
    const [loadingPopular, setLoadingPopular] = useState(false);

    /* Deduped at module level: shared with the NearestCity dropdown. */
    useEffect(() => {
        if (cityList.length) return;
        ensureCityList();
    }, [cityList.length]);

    useEffect(() => {
        setLoadingPopular(true);
        SiteService.fetchPopularCities({ limit: 9 }).then(res => {
            setPopularCities(res?.cities || []);
            setLoadingPopular(false);
        }).catch(() => {
            setLoadingPopular(false);
        });
    }, []);

    const cityLocalities = TOP_LOCALITIES.filter(l => !activeCity || l.city === activeCity.name);
    const visibleLocalities = showAllLocalities ? cityLocalities : cityLocalities.slice(0, 5);
    const cityProjects = TOP_PROJECTS.filter(p => !activeCity || p.city === activeCity.name);

    const handleSelectPopularCity = (cityName) => {
        const foundCity = cityList.find(c => c.name.toLowerCase() === cityName.toLowerCase());
        if (foundCity) {
            setActiveCity(foundCity);
        } else {
            // For dummy cities not in the list, just set it manually for demonstration
            setActiveCity({ id: `temp-${cityName}`, name: cityName });
        }
    };

    return (
        <div className="fixed inset-0 z-[120] bg-white flex flex-col animate-slide-up">
            {/* Header */}
            <div className="flex items-center px-4 py-3 border-b border-gray-200">
                <button onClick={onClose} className="p-1 -ml-1 text-gray-700 hover:text-black">
                    <HiOutlineArrowLeft className="w-5 h-5" />
                </button>
                
                <div className="flex-1 flex items-center ml-3 overflow-hidden">
                    {/* Selected City Pill inside input area */}
                    {activeCity && (
                        <div className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-[#002B5B] border border-blue-200 rounded-full text-xs font-semibold whitespace-nowrap mr-2">
                            {activeCity.name}
                            <button onClick={() => setActiveCity(null)} className="ml-0.5 hover:text-[#001f42]">
                                <HiOutlineX className="w-3 h-3" />
                            </button>
                        </div>
                    )}
                    
                    {activeCity && <div className="w-px h-6 bg-gray-300 mx-1"></div>}

                    <input
                        type="text"
                        placeholder={activeCity ? "Add More..." : "Enter City, Locality, Project"}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 min-w-[80px] bg-transparent border-none focus:outline-none focus:ring-0 text-[15px] placeholder-gray-500 py-1"
                    />
                </div>

                <button 
                    onClick={onClose}
                    className="ml-2 bg-[#002B5B] hover:bg-[#001f42] text-white px-4 py-1.5 rounded text-[15px] font-semibold transition-colors shadow-sm"
                >
                    Done
                </button>
            </div>

            {/* Current Location Bar */}
            <button className="flex items-center justify-between w-full px-4 py-3 bg-blue-50/50 text-[#002B5B] font-semibold text-sm hover:bg-blue-50 transition-colors border-b border-blue-100/50">
                <div className="flex items-center gap-3">
                    <BiTargetLock className="w-5 h-5" />
                    Use my Current Location
                </div>
                <MdOutlineChevronRight className="w-5 h-5" />
            </button>

            <div className="flex-1 overflow-y-auto pb-20">
                {!activeCity ? (
                    /* Popular Cities View */
                    <div className="p-4">
                        <h3 className="text-sm font-bold text-gray-800 mb-6">Popular Cities</h3>
                        <div className="grid grid-cols-3 gap-y-6">
                            {loadingPopular && popularCities.length === 0 ? (
                                <div className="col-span-3 text-center text-sm text-gray-500 py-4">Loading cities...</div>
                            ) : (
                                popularCities.map((city) => (
                                    <button 
                                    key={city.id}
                                    onClick={() => handleSelectPopularCity(city.name)}
                                    className="flex flex-col items-center gap-2 group"
                                >
                                    <div className="w-16 h-16 rounded-full border border-gray-200 flex items-center justify-center bg-white group-hover:border-[#002B5B] transition-colors overflow-hidden relative shrink-0">
                                        {city?.banner ? (
                                            <Image
                                                src={city.banner}
                                                alt={city.name}
                                                fill
                                                className="object-cover"
                                                sizes="64px"
                                            />
                                        ) : (
                                            <HiOutlineOfficeBuilding className="w-8 h-8 text-gray-400 group-hover:text-white transition-colors z-10" />
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-600 font-medium">{city.name}</span>
                                </button>
                                ))
                            )}
                        </div>
                    </div>
                ) : (
                    /* Active City Views */
                    <>
                        {/* Recently Searched */}
                        {/* <div className="p-4 border-b border-gray-100">
                            <h3 className="text-sm font-bold text-[#002B5B] mb-3">Recently Searched</h3>
                            <div className="flex flex-wrap gap-2">
                                {RECENTLY_SEARCHED.map((item) => (
                                    <button 
                                        key={item.id}
                                        className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-[13px] font-medium hover:bg-gray-200 transition-colors"
                                    >
                                        {item.name}
                                    </button>
                                ))}
                            </div>
                        </div> */}

                        {/* Top Localities */}
                        <div className="p-4 border-b border-gray-100 mt-4">
                            <h3 className="text-sm font-bold text-[#002B5B] mb-3">Top Localities in {activeCity.name}</h3>
                            <div className="flex flex-wrap gap-2 items-center">
                                {visibleLocalities.map((loc) => {
                                    const isSelected = selectedLocalities.some(sl => sl.id === loc.id);
                                    return (
                                        <button 
                                            key={loc.id}
                                            onClick={() => toggleLocality(loc)}
                                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                                                isSelected 
                                                ? 'bg-blue-50 text-[#002B5B] border-[#002B5B]' 
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            {loc.name}
                                        </button>
                                    );
                                })}
                                {cityLocalities.length > 5 && (
                                    <button 
                                        onClick={() => setShowAllLocalities(!showAllLocalities)}
                                        className="text-[#002B5B] text-xs font-semibold ml-1 hover:underline"
                                    >
                                        {showAllLocalities ? '- less' : '+ more'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Top Projects */}
                        <div className="p-4">
                            <h3 className="text-sm font-bold text-[#002B5B] mb-3">Top Projects in {activeCity.name}</h3>
                            <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
                                {cityProjects.map((proj) => (
                                    <div 
                                        key={proj.id} 
                                        className="flex min-w-[240px] max-w-[280px] bg-white border border-gray-200 rounded-lg overflow-hidden shrink-0 shadow-sm"
                                    >
                                        <div className="w-[80px] h-[80px] shrink-0 relative bg-gray-200">
                                            <Image 
                                                src={proj.image}
                                                alt={proj.name}
                                                fill
                                                className="object-cover"
                                                sizes="80px"
                                            />
                                        </div>
                                        <div className="p-3 flex flex-col justify-center flex-1 min-w-0">
                                            <h4 className="text-[13px] font-bold text-gray-900 truncate">{proj.name}</h4>
                                            <p className="text-[12px] text-gray-500 truncate">{proj.location}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

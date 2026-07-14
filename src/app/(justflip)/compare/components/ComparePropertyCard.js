import React from 'react';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { BsBuilding } from 'react-icons/bs';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';
import { convertToCurrency } from '@/src/utils/RenderFunction';

export default function ComparePropertyCard({ 
    property, 
    idx, 
    expandedUnits, 
    setExpandedUnits, 
    expandedAmenities, 
    setExpandedAmenities, 
    handleRemove, 
    handleProperty 
}) {
    return (
        <article className="w-[300px] min-w-[300px] md:w-[320px] md:min-w-[320px] lg:w-auto lg:min-w-0 shrink-0 lg:shrink snap-center bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all flex flex-col relative z-10 overflow-hidden group">
            {/* Header / Image Area */}
            <header className="relative h-48 lg:h-64 bg-gray-100 cursor-pointer overflow-hidden" onClick={() => handleProperty(property)}>
                <img
                    src={property?.medias?.find(o => o.type === "image" && o.title?.toLowerCase() === "banner")?.url || "/placeholder-property.jpg"}
                    alt={`Banner for ${property?.name || 'Property'}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#002B5B]/90 via-[#002B5B]/30 to-transparent" aria-hidden="true" />
                
                <button 
                    onClick={(e) => { e.stopPropagation(); handleRemove(property?.id); }} 
                    className="absolute top-4 right-4 bg-white/20 hover:bg-red-500 backdrop-blur-md rounded-full p-2 text-white transition-all z-20"
                    title="Remove from compare"
                    aria-label={`Remove ${property?.name} from comparison`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>

                <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold rounded-full mb-2 uppercase tracking-wide">
                        Property {idx + 1}
                    </span>
                    <h3 className="text-white text-xl font-bold leading-tight">
                        {property?.name}
                    </h3>
                </div>
            </header>

            {/* Quick Stats (Mobile visible, Desktop too) */}
            <div className="h-[92px] px-5 py-4 border-b border-gray-50 flex flex-wrap gap-2 bg-[#f8fbfe] overflow-hidden content-start">
                <span className="flex items-center gap-1.5 bg-white border border-blue-100/50 text-[#002B5B] text-xs font-semibold px-3 py-1.5 rounded-xl shadow-sm">
                    <BsBuilding size={12} className="text-blue-500" aria-hidden="true" />
                    {property?.towers} Towers
                </span>
                <span className="flex items-center gap-1.5 bg-white border border-blue-100/50 text-[#002B5B] text-xs font-semibold px-3 py-1.5 rounded-xl shadow-sm">
                    {property?.floors || "N/A"} Floors
                </span>
                <span className="flex items-center gap-1.5 bg-white border border-blue-100/50 text-[#002B5B] text-xs font-semibold px-3 py-1.5 rounded-xl shadow-sm">
                    {property?.landParcel} Acres
                </span>
            </div>

            {/* Detailed Stats */}
            <div className="flex-1 py-5 lg:py-4">
                
                {/* Location */}
                <div className="h-24 lg:h-16 flex flex-col justify-center bg-gray-50/80 px-5 py-4 lg:py-0">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 lg:hidden">Location</p>
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                            <HiOutlineLocationMarker size={16} className="text-[#002B5B]" aria-hidden="true" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900 leading-tight line-clamp-2" title={property?.location?.name}>
                                {property?.location?.name || "N/A"}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1" title={`${property?.zone?.name}, ${property?.city?.name}`}>
                                {property?.zone?.name}, {property?.city?.name}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Builder */}
                <div className="h-24 lg:h-16 flex flex-col justify-center px-5 py-4 lg:py-0 border-t border-gray-50 lg:border-none">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 lg:hidden">Builder</p>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                            <BsBuilding size={14} className="text-orange-500" aria-hidden="true" />
                        </div>
                        <p className="text-sm font-bold text-gray-900 line-clamp-2" title={property?.builder?.name}>
                            {property?.builder?.name || "N/A"}
                        </p>
                    </div>
                </div>

                {/* Unit Types */}
                <div className="h-44 lg:h-32 flex flex-col justify-center bg-gray-50/80 px-5 py-4 lg:py-0 border-t border-gray-50 lg:border-none">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 lg:hidden">Unit Types & Price</p>
                    
                    {expandedUnits[property.id] || (property?.units?.length || 0) <= 2 ? (
                        <div className="flex flex-col gap-2 w-full overflow-y-auto max-h-[90px] pr-1 pb-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300">
                            {property?.units?.map((unit, i) => (
                                <div key={i} className="flex justify-between items-center bg-white hover:bg-gray-50 transition-colors px-3 py-2.5 rounded-lg border border-gray-100 shadow-sm shrink-0">
                                    <span className="text-xs font-bold text-gray-700">{unit.type}</span>
                                    <span className="text-xs font-bold text-[#002B5B]">
                                        {unit.minPrice ? `₹${convertToCurrency(unit.minPrice)}` : "-"}
                                    </span>
                                </div>
                            ))}
                            {!(property?.units?.length) && (
                                <span className="text-xs text-gray-400 italic">No configurations listed</span>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2 w-full">
                            {property?.units?.slice(0, 2).map((unit, i) => (
                                <div key={i} className="flex justify-between items-center bg-white hover:bg-gray-50 transition-colors px-3 py-2.5 rounded-lg border border-gray-100 shadow-sm shrink-0">
                                    <span className="text-xs font-bold text-gray-700">{unit.type}</span>
                                    <span className="text-xs font-bold text-[#002B5B]">
                                        {unit.minPrice ? `₹${convertToCurrency(unit.minPrice)}` : "-"}
                                    </span>
                                </div>
                            ))}
                            <button 
                                onClick={() => setExpandedUnits(prev => ({ ...prev, [property.id]: true }))}
                                className="text-[10px] font-semibold text-gray-400 italic px-1 pt-1 text-left hover:text-blue-500 transition-colors"
                            >
                                + {property.units.length - 2} more configurations
                            </button>
                        </div>
                    )}
                </div>

                {/* Total Units */}
                <div className="h-24 lg:h-16 flex flex-col justify-center px-5 py-4 lg:py-0 border-t border-gray-50 lg:border-none">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 lg:hidden">Total Units</p>
                    <div className="flex">
                        <span className="inline-flex items-center gap-2 text-sm font-bold text-gray-900 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl">
                            <div className="w-2 h-2 rounded-full bg-[#002B5B]" aria-hidden="true"></div>
                            {property?.totalUnits || "N/A"} Units
                        </span>
                    </div>
                </div>

                {/* Amenities */}
                <div className="h-60 lg:h-48 flex flex-col justify-center bg-gray-50/80 px-5 py-4 lg:py-0 border-t border-gray-50 lg:border-none">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 lg:hidden">Amenities</p>
                    
                    {expandedAmenities[property.id] || (property?.amenities?.length || 0) <= 6 ? (
                        <div className="flex flex-wrap content-start gap-2 overflow-y-auto max-h-[140px] lg:max-h-[160px] pr-1 pb-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300">
                            {(property?.amenities || []).map((amenity, i) => (
                                <div key={i} className="flex items-center gap-1.5 bg-white border border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] rounded-full px-3 py-1.5 text-[10px] font-bold text-gray-600 hover:border-blue-200 transition-colors">
                                    <img src={amenity?.image} alt={amenity.name} className="w-3.5 h-3.5 rounded-full object-cover shrink-0" />
                                    <span>{amenity.name}</span>
                                </div>
                            ))}
                            {!(property?.amenities?.length) && (
                                <span className="text-xs text-gray-400 italic">No amenities listed</span>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-wrap content-start gap-2 pb-1">
                            {(property?.amenities || []).slice(0, 6).map((amenity, i) => (
                                <div key={i} className="flex items-center gap-1.5 bg-white border border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] rounded-full px-3 py-1.5 text-[10px] font-bold text-gray-600 hover:border-blue-200 transition-colors">
                                    <img src={amenity?.image} alt={amenity.name} className="w-3.5 h-3.5 rounded-full object-cover shrink-0" />
                                    <span>{amenity.name}</span>
                                </div>
                            ))}
                            <button 
                                onClick={() => setExpandedAmenities(prev => ({ ...prev, [property.id]: true }))}
                                className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-full px-3 py-1.5 text-[10px] font-bold text-gray-500 transition-colors cursor-pointer"
                            >
                                + {property.amenities.length - 6} more
                            </button>
                        </div>
                    )}
                </div>

                {/* Status */}
                <div className="h-28 lg:h-16 flex flex-col justify-center px-5 pb-6 pt-4 lg:py-0 border-t border-gray-50 lg:border-none">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 lg:hidden">Possession Status</p>
                    <div className="flex">
                        <span className="inline-flex items-center gap-2 bg-green-50/50 border border-green-100 text-green-700 text-xs font-bold px-4 py-2.5 rounded-xl">
                            <IoCheckmarkCircleOutline size={18} className="text-green-500" aria-hidden="true" />
                            {property?.possessionDate
                                ? new Date(property.possessionDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
                                : "Ready to Move"}
                        </span>
                    </div>
                </div>
            </div>
        </article>
    );
}

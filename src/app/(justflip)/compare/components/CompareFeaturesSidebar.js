import React from 'react';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { BsBuilding } from 'react-icons/bs';
import { FiLayers, FiGrid, FiStar } from 'react-icons/fi';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';

const features = [
    { label: 'Location', height: 'h-16', bg: 'bg-blue-50', border: 'border-blue-100/50', iconColor: 'text-blue-600', icon: HiOutlineLocationMarker, iconSize: 'text-lg', labelSize: 'text-lg' },
    { label: 'Builder', height: 'h-16', bg: 'bg-orange-50', border: 'border-orange-100/50', iconColor: 'text-orange-600', icon: BsBuilding, iconSize: 'text-sm', labelSize: 'text-lg' },
    { label: 'Unit Types', height: 'h-32', bg: 'bg-purple-50', border: 'border-purple-100/50', iconColor: 'text-purple-600', icon: FiGrid, iconSize: 'text-sm', labelSize: 'text-lg' },
    { label: 'Total Units', height: 'h-16', bg: 'bg-teal-50', border: 'border-teal-100/50', iconColor: 'text-teal-600', icon: FiLayers, iconSize: 'text-sm', labelSize: 'text-lg' },
    { label: 'Amenities', height: 'h-48', bg: 'bg-pink-50', border: 'border-pink-100/50', iconColor: 'text-pink-600', icon: FiStar, iconSize: 'text-sm', labelSize: 'text-lg' },
    { label: 'Status', height: 'h-16', bg: 'bg-green-50', border: 'border-green-100/50', iconColor: 'text-green-600', icon: IoCheckmarkCircleOutline, iconSize: 'text-lg', labelSize: 'text-lg' }
];

const FeatureRow = ({ feature }) => {
    const Icon = feature.icon;
    return (
        <div className={`${feature.height} flex items-center`}>
            <div className="flex items-center gap-3 w-full group">
                <div className={`w-8 h-8 rounded-xl ${feature.bg} flex items-center justify-center border ${feature.border} shadow-sm transition-transform group-hover:scale-110`}>
                    <Icon className={`${feature.iconColor} ${feature.iconSize}`} />
                </div>
                <span className={`text-gray-700 font-bold tracking-wide ${feature.labelSize || ''}`}>
                    {feature.label}
                </span>
            </div>
        </div>
    );
};

export default function CompareFeaturesSidebar() {
    return (
        <aside className="hidden lg:flex flex-col lg:col-span-2 text-sm font-semibold text-gray-500 bg-transparent relative z-0 pr-4">
            {/* Invisible dummy block to exactly match the height of the card's top section */}
            <div className="invisible" aria-hidden="true">
                <div className="h-64 border border-transparent"></div>
                <div className="h-[92px] px-5 py-4 border-b border-transparent flex flex-wrap gap-2 content-start">
                    <span className="px-3 py-1.5 text-xs border border-transparent">Dummy</span>
                </div>
                <div className="h-4"></div>
            </div>

            {features.map((feature, idx) => (
                <FeatureRow key={idx} feature={feature} />
            ))}
        </aside>
    );
}

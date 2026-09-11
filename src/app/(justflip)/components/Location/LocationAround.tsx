"use client";

import { useState, useMemo } from "react";
import { CATEGORY_ICONS, TABS } from "./location.config";
import { getTabData } from "./location.utils";

export default function LocationAround({ services = [] }: { services?: any[] }) {
    const [activeTab, setActiveTab] = useState("Connectivity");

    const tabData = useMemo(() => {
        return getTabData(services, activeTab);
    }, [services, activeTab]);

    return (
        <div className="w-full">
            <h2 className="section-heading mb-3">Nearby Areas</h2>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                {/* Tabs Header */}
                <div className="grid grid-cols-2 sm:grid-cols-4 bg-gray-50 border-b border-gray-200 p-1.5 gap-1.5">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.name;

                        return (
                            <button
                                key={tab.name}
                                onClick={() => setActiveTab(tab.name)}
                                className={`px-4 py-2.5 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                                    isActive
                                        ? "bg-primary text-white shadow-sm font-semibold"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                                }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-500"}`} />
                                <span className="truncate">{tab.name}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Content Area */}
                <div className="p-6 min-h-[160px]">
                    {tabData.some((c) => c.items.length > 0) ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            {tabData.map((category) => {
                                if (category.items.length === 0) return null;
                                const CategoryIcon = CATEGORY_ICONS[category.key as keyof typeof CATEGORY_ICONS];

                                return (
                                    <div key={category.key} className="space-y-3">
                                        {/* Category Title */}
                                        <div className="flex items-center gap-2">
                                            {CategoryIcon && (
                                                <span className="text-primary">
                                                    <CategoryIcon className="w-4 h-4" />
                                                </span>
                                            )}
                                            <span className="text-xs font-bold uppercase tracking-wider text-gray-800">
                                                {category.key}
                                            </span>
                                        </div>

                                        {/* Clean List Items (No Nested Cards) */}
                                        <ul className="divide-y divide-gray-100 border-t border-b border-gray-100">
                                            {category.items.map((item: any, i: number) => (
                                                <li key={i} className="flex items-center justify-between py-2.5 text-xs sm:text-sm">
                                                    <span className="text-gray-700 font-medium">{item.name}</span>
                                                    {item.distance && (
                                                        <span className="text-gray-400 text-xs font-normal">
                                                            {item.distance}
                                                        </span>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center text-gray-400 text-sm">
                            <p>No nearby {activeTab.toLowerCase()} data available.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
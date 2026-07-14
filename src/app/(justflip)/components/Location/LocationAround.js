"use client";

import { useState, useMemo } from "react";
import { CATEGORY_ICONS, TABS } from "./location.config";
import { getTabData } from "./location.utils";

export default function LocationAround({ services = [] }) {
    const [activeTab, setActiveTab] = useState("Connectivity");

    const tabData = useMemo(() => {
        return getTabData(services, activeTab);
    }, [services, activeTab]);

    return (
        <div className="">
            <h2 className="pb-4 text-lg font-medium">Nearby Areas</h2>

            <div className="border border-gray-300 rounded-lg overflow-hidden">

                <div className="flex overflow-x-auto">
                    {TABS.map((tab, i) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.name;

                        return (
                            <button
                                key={tab.name}
                                onClick={() => setActiveTab(tab.name)}
                           
                                className={`px-4 py-2 w-full  gap-2 text-sm  border transition-all duration-300 inline-flex justify-center items-center cursor-pointer ${isActive
                                        ? "bg-[#002B5B] border-[#002B5B] text-white font-bold"
                                        : "border-gray-400 text-[#333333] font-normal"
                                    } ${i === 0 ? "rounded-tl-lg" : ""} ${i === TABS.length - 1 ? "rounded-tr-lg" : ""
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {tab.name}
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                <div className="p-4 min-h-[120px]">
                    {tabData.some((c) => c.items.length > 0) ? (
                        <div className="grid md:grid-cols-2 gap-3">
                            {tabData.map(
                                (category) =>
                                    category.items.length > 0 && (
                                        <ul key={category.key} className="ml-4 list-disc">
                                            {category.items.map((item, i) => {
                                                const Icon = CATEGORY_ICONS[category.key];

                                                return (
                                                    <li key={i} className="flex items-center py-1">
                                                        <span className="border rounded-full p-1 text-[#002B5B]">
                                                            <Icon className="w-3 h-3" />
                                                        </span>
                                                        <span className="ml-2 text-xs">
                                                            {item.name}
                                                        </span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )
                            )}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm">No data available</p>
                    )}
                </div>
            </div>
        </div>
    );
}
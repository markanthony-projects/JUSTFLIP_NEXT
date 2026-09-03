"use client";

import React, { useState, useRef, useMemo } from "react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

const CITIES = [
    "Bangalore", "Pune", "Mysuru", "Chennai", "Mumbai", "Hyderabad", "New Delhi",
    "Ahmedabad", "Kolkata", "Gurgaon", "Noida"
];
type CityAreas = {
    flats?: string[];
    houses?: string[];
    property?: string[];
    plots?: string[];
    villas?: string[];
};

const CITY_AREAS_DATA: Record<string, CityAreas> = {
    "Bangalore": {
        flats: ["Whitefield", "Sarjapur Road", "Electronic City", "Koramangala", "HSR Layout", "Marathahalli", "Hebbal", "Kanakapura Road", "Bellandur", "Varthur"],
        houses: ["Whitefield", "HSR Layout", "JP Nagar", "Koramangala", "Sarjapur Road", "Hebbal", "Yelahanka", "Electronic City", "Marathahalli", "Bellandur"],
        property: ["Whitefield", "Sarjapur Road", "Electronic City", "Koramangala", "HSR Layout", "Marathahalli", "Hebbal", "JP Nagar", "Bellandur", "Varthur"],
        plots: ["Whitefield", "Sarjapur Road", "Yelahanka", "Electronic City", "HSR Layout", "Kanakapura Road", "Marathahalli", "JP Nagar", "Sarjapur", "Bellandur"],
        villas: ["Whitefield", "Sarjapur Road", "Electronic City", "Yelahanka", "Kanakapura Road", "Koramangala", "HSR Layout", "Marathahalli", "JP Nagar", "Bellandur"]
    },
    "Pune": {
        flats: ["Kharadi", "Hinjewadi", "Viman Nagar Central", "Wagholi", "Magarpatta City", "Wakad", "Pimpri Chinchwad", "Baner", "Kothrud", "Hadapsar"],
        houses: ["Pimpri Chinchwad", "Hadapsar", "Wagholi", "Talegaon Dabhade", "Pimple Saudagar", "Wakad", "Kharadi", "Baner", "Viman Nagar Central", "Hinjewadi"],
        property: ["Baner", "Kharadi", "Wakad", "Hinjewadi", "Wagholi", "Hadapsar", "Bavdhan", "Koregaon Park", "Moshi", "Lonavala"],
        plots: ["Hinjewadi", "Wagholi", "Kharadi", "Baner", "Hadapsar", "Wakad", "Lonavala", "Pimpri Chinchwad", "Moshi", "Chakan"],
        villas: ["Baner", "Bavdhan", "NIBM Road", "Kharadi", "Pimple Saudagar", "Undri", "Lohegaon", "Wagholi", "Lonavala"]
    },
    "Mysuru": {
        flats: ["Khandya", "Ring Road", "Hebbal", "Gokulam Road", "Bogadi", "Vijay Nagar", "Saraswathipuram", "Ring Road", "KR Mohalla", "Chamundi Vihar"],
        houses: ["Gokulam", "Vijaya Bank Layout", "Karanji Layout", "Ring Road", "Hebbal", "Saraswathipuram", "KR Mohalla", "Bogadi", "Rajiv Nagar", "Chandan Street"],
        property: ["Ring Road", " Hebbal", "Vidyaranyapuram", "Alanahalli", "JLB Road", "Gokulam", "Saraswathipuram", "Chamaraja Double Road", "Karanji Layout", "JP Nagar"],
        plots: ["Ring Road", "Alanahalli", "Kandya", "JP Nagar", "Vijaya Bank Layout", "Chamaraja Double Road", "Hebbal", "Gokulam Road", "Karanji Layout", "Chamundi Vihar"],
        villas: ["Ring Road", "Alanahalli", "Vijaya Bank Layout", "Karanji Layout", "Gokulam", "JLB Road", "Saraswathipuram", "JP Nagar", "Hebbal", "Khandya"]
    },
    "Chennai": {
        flats: ["Anna Nagar", "Porur", "Velachery", "Sholinganallur", "Mogappair", "Nanganallur", "Adyar", "Mylapore", "Medavakkam", "OMR"],
        houses: ["Velachery", "Avadi", "Kolathur", "Porur", "Ambattur", "Anna Nagar", "Madipakkam", "Perambur"],
        property: ["Anna Nagar", "Porur", "Ambattur", "Velachery", "Medavakkam", "Perungudi", "Madipakkam", "Sholinganallur", "Madhavaram", "Nanganallur"],
        plots: ["Avadi", "Madipakkam", "Pallikaranai", "Medavakkam", "Urapakkam", "Kelambakkam", "Kundrathur", "Madhavaram", "Tambaram", "Thirumazhisai"],
        villas: ["Medavakkam", "Sholinganalur", "Kelambakkam", "Ambattur", "Perungalathur", "Pallikaranai", "Perumbakkam", "Porur", "Perungudi", "Tambaram"]
    },
    "Mumbai": {
        flats: ["Andheri East", "Chembur", "Borivali West", "Virar West", "Kandivali West", "Bandra West", "Goregaon West", "Mira Road", "Goregaon East", "Andheri West"],
        houses: ["Bandra West", "Chembur", "Andheri West", "Borivali West", "Virar", "Mira Road", "Malad West", "Juhu", "Andheri East", "Vasai"],
        property: ["Mira Road", "Andheri West", "Chembur", "Goregaon East", "Borivali West", "Kandivali West", "Malad West", "Andheri East", "Goregaon West", "Virar West"],
        plots: ["Vasai", "Mira Road", "Virar", "Andheri East", "Charkop", "Virar West", "Naigaon Palghar", "Bandra West", "Vaishali Nagar", "Goregaon East"],
        villas: ["Juhu", "Andheri West", "Andheri East", "Worli", "Goregaon East", "Bandra West", "Goregaon West", "Borivali West", "Chembur", "Virar East"]
    },
    "Hyderabad": {
        flats: ["Kondapur", "Gachibowli", "Miyapur", "Kompally", "Kukatpally", "Kokapet", "Tellapur", "Bachupally", "Narsingi"],
        houses: ["Beeramguda", "Jubilee Hills", "Kukatpally", "Uppal", "Banjara Hills", "Vanasthalipuram", "Alwal", "Miyapur", "Gachibowli"],
        property: ["Gachibowli", "Kondapur", "Kompally", "Tellapur", "Kokapet", "Miyapur", "Banjara Hills", "Attapur", "Uppal"],
        plots: ["Shadnagar", "Kollur", "Mokila", "Shamshabad", "Medchal", "Kompally", "Maheshwaram", "Moinabad", "Tellapur", "Kondapur"],
        villas: ["Tellapur", "Kompally", "Gachibowli", "Mokila", "Bachupally", "Kokapet", "Kondapur", "Jubilee Hills", "Nizampet"]
    },
    "New Delhi": {
        flats: ["Saket", "Karol Bagh", "Lajpat Nagar", "Malviya Nagar", "Dwarka Mor", "Vasant Kunj", "Kalkaji", "Paschim Vihar", "Uttam Nagar", "Dwarka"],
        houses: ["Dwarka", "Uttam Nagar", "Janakpuri", "Najafgarh", "Vasant Vihar", "Pitampura", "Safdarjung Enclave", "Saket", "Vasant Kunj", "Defence Colony"],
        property: ["Vasant Kunj", "Saket", "Karol Bagh", "Janakpuri", "Uttam Nagar", "Paschim Vihar", "Rajouri Garden", "Sector 24 Rohini", "Dwarka Mor"],
        plots: ["Dwarka", "Najafgarh", "Sector 36 Rohini", "Sector 29 Rohini", "Dwarka Mor", "Narela", "Defence Colony", "Kalkaji", "Pitampura", "Ashok Nagar"],
        villas: ["Vasant Kunj", "New Friends Colony", "Janakpuri", "Chhattarpur", "Panchsheel Park", "Chanakyapuri", "Vasant Vihar", "Sainik Farm", "Saket", "GK I"]
    },
    "Ahmedabad": {
        flats: ["South Bopal", "Gota", "Chandkheda", "Science City", "Shilaj", "Thaltej", "Satellite", "Bopal", "Narolgam"],
        houses: ["Chandkheda", "Maninagar", "Naroda", "Nikol", "Bopal", "Vastral", "South Bopal", "Ghodasar", "Thaltej", "Ghatlodiya"],
        property: ["South Bopal", "Chandkheda", "Sanand", "Satellite", "Gota", "Bopal", "Thaltej", "Nikol", "Vastral", "Juhapura"],
        plots: ["Sanand", "Shilaj", "Bopal", "Rancharda", "South Bopal", "Gota", "Shela", "Bagodara", "Shahpur"],
        villas: ["Science City", "Bopal", "Thaltej", "South Bopal", "Chandkheda", "Shilaj", "Nana Chiloda", "Shela", "Vastral", "Nikol"]
    },
    "Kolkata": {
        flats: ["New Town", "Rajarhat", "Dum Dum", "Behala", "Garia", "Joka", "Howrah", "Barasat", "Barrackpore", "Uttarpara"],
        houses: ["Barrackpore", "Behala", "Howrah", "Sodepur", "Barasat", "Birati", "New Town", "Uttarpara", "Jorhat", "Salt Lake City"],
        property: ["New Town", "Rajarhat", "Joka", "Howrah", "Behala", "Dum Dum", "Tollygunge", "Barrackpore", "Sodepur", "Barasat"],
        plots: ["New Town", "Joka", "Action Area 1", "Barrackpore", "Howrah", "Rajarhat", "Behala", "Barasat", "Tollygunge", "Jorhat"],
        villas: ["New Town", "Rajarhat", "Joka", "Howrah", "Salt Lake City", "Diamond Harbour Road", "Action Area 3", "EM Bypass", "Rajpur Sonarpur", "Action Area 1"]
    },
    "Gurgaon": {
        flats: ["DLF Phase 2", "DLF Phase 5", "Ardee City", "Palam Vihar", "DLF Phase 1", "Sector 56", "Sector 57", "Sector 48", "Sector 37D", "Mehrauli Gurgaon Road"],
        houses: ["Palam Vihar", "South City 1", "Sushant Lok 1", "DLF Phase 1", "DLF Phase 2", "Sector 23", "Sector 4", "Sector 31", "Ashok Vihar Phase 2", "Laxman Vihar"],
        property: ["Ardee City", "Palam Vihar", "Nirvana Country", "Manesar", "Golf Course Road", "South City 2", "Sector 38", "Sohna Road", "Sector 23", "Sushant Lok"],
        plots: ["Palam Vihar", "Sector 57", "DLF Phase 1", "New Palam Vihar", "Sohna Road", "Sector 46", "Sushant Lok 1", "Sector 110A", "Sohna", "Sector 108"],
        villas: ["Nirvana Country", "Sector 109", "DLF Phase 4", "DLF Phase 1", "Sector 66", "Sector 86", "DLF Phase 2", "Sector 57", "Sector 48", "Sector 23"]
    },
    "Noida": {
        flats: ["Noida Extension", "Sector 150", "Sector 137", "Sector 75", "Sector 76", "Sector 62", "Sector 78", "Sector 128", "Sector 107", "Sector 77"],
        houses: ["Sector 12", "Sector 41", "Sector 20", "Sector 22", "Sector 19", "Sector 47", "Sector 49", "Sector 122", "Noida Extension", "Sector 62"],
        property: ["Sector 62", "Noida Extension", "Sector 15", "Sector 45", "Sector 50", "Sector 93", "Sector 100", "Sector 51", "Sector 134", "Sector 150"],
        plots: ["Noida Extension", "Sector 122", "Sector 144", "Sector 151", "Sector 105", "Sector 70", "Sector 108", "Sector 133", "Sector 150", "Sector 143"],
        villas: ["Noida Extension", "Sector 128", "Sector 135", "Sector 73", "Sector 150", "Sector 62", "Sector 61", "Sector 47", "Sector 46", "Sector 30"]
    }
    // Add other cities here following the exact same format!
};

const CITY_IDS: Record<string, string> = {
    "Bangalore": "007787eb-284b-4a20-9654-cacff161cf1e",
    "Pune": "f0f132fa-4514-42d7-b1fb-aea7eeed9a71",
    "Mysuru": "bfe4371d-a38d-4417-ab91-98be9b9a2482",
    "Chennai": "a7d6821a-4555-4f2f-9065-b4635adb7a8a",
    "Mumbai": "872f9c6e-e9f6-4a1e-9ef3-6204dc6528d7",
    "Hyderabad": "8395c36e-1740-468b-8705-31364d134f9a",
    "New Delhi": "9caeffa2-6465-49a1-8aa9-49268556c446",
    "Ahmedabad": "8b2f1231-b88d-41cf-ba64-6f080e20236f",
    "Kolkata": "eae772ac-5893-4b4d-b6d5-4eb65e174b0b",
    "Gurgaon": "78616bc2-3c71-4c7e-9849-497bb7179b20",
    "Noida": "7eff95ca-14e3-4304-b401-5e37fb16b5a8"
};

// Generate data for the selected city to populate the columns
const generateCityData = (cityName: string) => {
    // Look up the specific areas for this city, or provide a generic fallback
    const defaultAreas = ["Area 1", "Area 2", "Area 3", "Area 4", "Area 5", "Area 6", "Area 7", "Area 8"];
    const cityData = CITY_AREAS_DATA[cityName] || {};

    const flats = cityData.flats || defaultAreas;
    const houses = cityData.houses || defaultAreas;
    const property = cityData.property || defaultAreas;
    const plots = cityData.plots || defaultAreas;
    const villas = cityData.villas || defaultAreas;

    const cityId = CITY_IDS[cityName];
    const cityIdParam = cityId ? `&cityId=${cityId}` : "";

    return [
        {
            title: `Flats in ${cityName}`,
            links: flats.map(area => ({ label: `Flats in ${area}`, href: `/search?q=${encodeURIComponent(area)}${cityIdParam}&propertyType=apartment` }))
        },
        {
            title: `House for Sale in ${cityName}`,
            links: houses.map(area => ({ label: `House for Sale in ${area}`, href: `/search?q=${encodeURIComponent(area)}${cityIdParam}&propertyType=villa` }))
        },
        {
            title: `Property in ${cityName}`,
            links: property.map(area => ({ label: `Property in ${area}`, href: `/search?q=${encodeURIComponent(area)}${cityIdParam}` }))
        },
        {
            title: `Plots in ${cityName}`,
            links: plots.map(area => ({ label: `Plots in ${area}`, href: `/search?q=${encodeURIComponent(area)}${cityIdParam}&propertyType=plot` }))
        },
        {
            title: `Villas in ${cityName}`,
            links: villas.map(area => ({ label: `Villas in ${area}`, href: `/search?q=${encodeURIComponent(area)}${cityIdParam}&propertyType=villa` }))
        }
    ];
};

const PreFooter = () => {
    const [activeCity, setActiveCity] = useState(CITIES[0]);
    const tabsRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const scrollTabs = () => {
        if (tabsRef.current) {
            tabsRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    const scrollContent = (direction: 'left' | 'right') => {
        if (contentRef.current) {
            const amount = 300;
            contentRef.current.scrollBy({ left: direction === 'right' ? amount : -amount, behavior: 'smooth' });
        }
    };

    const currentData = useMemo(() => generateCityData(activeCity), [activeCity]);

    return (
        <section className="bg-linear-to-b from-gray-100 to-white py-12 border-t border-gray-200">
            <div className="px-4 lg:px-8 max-w-[1300px] mx-auto">

                {/* Tabs Section */}
                <div className="relative border-b border-gray-200 mb-8 flex items-center">
                    <div
                        ref={tabsRef}
                        className="flex overflow-x-auto scroll-smooth w-full pr-16"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {/* webkit-scrollbar hiding inline for broader support */}
                        <style dangerouslySetInnerHTML={{ __html: `div::-webkit-scrollbar { display: none; }` }} />

                        <div className="flex space-x-8 min-w-max">
                            {CITIES.map((city) => (
                                <button
                                    key={city}
                                    onClick={() => setActiveCity(city)}
                                    className={`pb-3 text-[15px] font-medium transition-colors whitespace-nowrap ${activeCity === city
                                        ? 'text-[#002B5B] border-b-[3px] border-[#002B5B]'
                                        : 'text-gray-500 hover:text-[#002B5B] border-b-[3px] border-transparent'
                                        }`}
                                >
                                    {city}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right arrow for scrolling tabs */}
                    <div className="absolute right-0 bottom-0 top-0 w-20 flex justify-end items-start pt-1 pointer-events-none">
                        <button
                            onClick={scrollTabs}
                            aria-label="Scroll city tabs right"
                            className="pointer-events-auto flex items-center justify-center text-gray-500 hover:text-[#002B5B] bg-gray-100/80 backdrop-blur-sm rounded-l-md px-2 shadow-sm"
                        >
                            <FiArrowRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Content Section */}
                <div className="relative group">
                    {/* Left Arrow for Content */}
                    <button
                        onClick={() => scrollContent('left')}
                        aria-label="Scroll content left"
                        className="opacity-0 group-hover:opacity-100 transition-opacity hidden lg:flex absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-[0_0_15px_rgba(0,0,0,0.08)] items-center justify-center text-gray-600 hover:text-gray-900 z-10 border border-gray-50"
                    >
                        <FiArrowRight size={20} className="rotate-180" />
                    </button>

                    <div
                        ref={contentRef}
                        className="flex overflow-x-auto scroll-smooth w-full gap-2 snap-x snap-mandatory pb-4"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {currentData.map((col, idx) => (
                            <div key={idx} className="flex flex-col w-[280px] sm:w-[calc(50%-1rem)] 
                            lg:w-[calc(25%-3.5rem)] flex-none snap-start">
                                <h3 className="text-[15px] font-bold text-gray-800 mb-3">
                                    {col.title}
                                </h3>
                                <ul className="space-y-1">
                                    {col.links.map((link, linkIdx) => (
                                        <li key={linkIdx}>
                                            <Link
                                                href={link.href}
                                                className="text-[14px] text-gray-500 hover:text-[#002B5B] transition-colors duration-200 block truncate"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Right Arrow for Content */}
                    <button
                        onClick={() => scrollContent('right')}
                        aria-label="Scroll content right"
                        className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-[0_0_15px_rgba(0,0,0,0.08)] items-center justify-center text-gray-600 hover:text-gray-900 z-10 border border-gray-50"
                    >
                        <FiArrowRight size={20} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default PreFooter;
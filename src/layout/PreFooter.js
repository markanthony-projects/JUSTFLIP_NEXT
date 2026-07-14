import React from "react";

const Section = ({ title, links }) => (
    <div className="flex flex-col">
        <h3 className="text-xs font-semibold text-gray-500 tracking-widest uppercase mb-4">
            {title}
        </h3>

        <ul className="space-y-2">
            {links.map((item, index) => (
                <li key={index}>
                    <a
                        href={item.href}
                        className="group text-xs text-gray-700 hover:text-black transition duration-200 flex items-center"
                    >
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2 group-hover:bg-black transition duration-200"></span>
                        {item.label}
                    </a>
                </li>
            ))}
        </ul>
    </div>
);

const PreFooter = () => {

    const popularCities = [
        { label: "Projects in Bengaluru", href: "/listings/?search=bengaluru" },
        { label: "Projects in Dubai", href: "/listings/?search=dubai" },
        { label: "Projects in Mysuru", href: "/listings/?search=mysuru" },
        { label: "Projects in Pune", href: "/listings/?search=pune" },
        { label: "Projects in Chennai", href: "/listings/?search=chennai" },
    ];

    const popularZones = [
        { label: "Projects in East Bengaluru", href: "/listings/?search=east" },
        { label: "Projects in West Bengaluru", href: "/listings/?search=west" },
        { label: "Projects in North Bengaluru", href: "/listings/?search=north" },
        { label: "Projects in South Bengaluru", href: "/listings/?search=south" },
    ];

    const apartments = [
        "Whitefield",
        "Bannerghatta Road",
        "Sarjapur Road",
        "Devanahalli",
        "Mysore Road",
        "Electronic City",
        "Bagalur",
    ].map((area) => ({
        label: `Apartments in ${area}`,
        href: `/listings/?search=${area.toLowerCase().replace(/\s+/g, "-")}&propertyType=apartment`,
    }));

    const plots = [
        "Devanahalli",
        "Sarjapur Road",
        "Bannerghatta Road",
        "Mysore Road",
        "Electronic City",
        "Bagalur",
    ].map((area) => ({
        label: `Plots in ${area}`,
        href: `/listings/?search=${area.toLowerCase().replace(/\s+/g, "-")}&propertyType=plot`,
    }));

    const villas = [
        "Devanahalli",
        "Yelahanka",
        "Sarjapur Road",
        "Varthur",
        "Anekal",
    ].map((area) => ({
        label: `Villas in ${area}`,
        href: `/listings/?search=${area.toLowerCase().replace(/\s+/g, "-")}&propertyType=villa`,
    }));

    const apartmentsByZone = [
        "East Bengaluru",
        "West Bengaluru",
        "North Bengaluru",
        "South Bengaluru",
        "Central Bengaluru",
    ].map((zone) => {
        const zoneNameOnly = zone.replace(/bengaluru/i, "").trim();
        return {
            label: `Apartments in ${zone}`,
            href: `/listings/?search=${zoneNameOnly.toLowerCase()}&propertyType=apartment`,
        };
    });

    return (
        <section className="bg-linear-to-b from-gray-100 to-white border-t border-gray-200 py-8 ">
            <div className="py-8 px-4 lg:px-6 max-w-310 mx-auto">

                <div className="text-center mb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-[#002B5B] leading-tight">
                        Explore Verified Projects Across Prime Cities & Growth Corridors
                    </h2>
                    <div className="w-20 h-1 bg-[#002B5B] mx-auto mt-2 rounded"></div>
                    <p className="mt-4 text-gray-600 text-xs md:text-base  mx-auto leading-relaxed">
                        Discover curated apartments, luxury villas, premium plots and high-growth investment opportunities across strategic micro-markets.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4">
                    <Section title="Popular Cities" links={popularCities} />
                    <Section title="Popular Zones" links={popularZones} />
                    <Section title="Apartments by Zone" links={apartmentsByZone} />
                    <Section title="Apartments in Bengaluru" links={apartments} />
                    <Section title="Plots in Bengaluru" links={plots} />
                    <Section title="Villas in Bengaluru" links={villas} />
                </div>

            </div>
        </section>
    );
};

export default PreFooter;
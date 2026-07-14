

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BsBuildingFillGear } from "react-icons/bs";
import { PiBuildingApartment } from "react-icons/pi";
import { SlLocationPin } from "react-icons/sl";
import JustflipService from "../services/JustflipService";
import { formatUrl } from "../utils/URLFormatter";
import { TextField } from "./Inputs";
import { CiSearch } from "react-icons/ci";


/* -------------------------------------------------
   API
-------------------------------------------------- */
const fetchSuggestions = async (query) => {
    if (!query) return { projects: [], builders: [], locations: [] };
    return await JustflipService.suggestions(query);
};

const emptySuggestions = {
    projects: [],
    builders: [],
    locations: [],
};

const SearchBar = () => {
    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState(emptySuggestions);
    const [activeIndex, setActiveIndex] = useState(-1);

    const debounceRef = useRef(null);
    const containerRef = useRef(null);

    const flatSuggestions = [
        ...suggestions.projects.map((p) => ({ type: "project", data: p })),
        ...suggestions.locations.map((l) => ({ type: "location", data: l })),
        ...suggestions.builders.map((b) => ({ type: "builder", data: b })),
    ];

    const hasSuggestions = flatSuggestions.length > 0;

    /* -------------------------------------------------
       Debounced Search
    -------------------------------------------------- */
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(async () => {
            const res = await fetchSuggestions(search);
            setSuggestions(res);
            setActiveIndex(-1);
        }, 250);

        return () => clearTimeout(debounceRef.current);
    }, [search]);

    /* -------------------------------------------------
       Click Outside
    -------------------------------------------------- */
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setSuggestions(emptySuggestions);
                setActiveIndex(-1);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative w-full max-w-4xl  bg-white rounded-lg  shadow-lg shadow-black/20 flex items-stretch h-10"
        >
  
            <div className="relative flex-1 flex items-center p-1">
                <TextField
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search projects, locations, builders & many more ..."
                    className="border-none focus:ring-0  text-xs md:text-sm"
                />

                <button
                    className="cursor-pointer h-full w-fit sm:w-[100px] px-2 rounded-md bg-[#002B5B] text-white text-xs lg:text-sm font-medium hover:bg-[#003a7a] transition"
                >
                    <span className="hidden sm:block">Search</span>
                    <span className="block sm:hidden"><CiSearch /></span>
                </button>

                {/* Suggestions */}
                {hasSuggestions && (
                    <div
                        className=" absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-60 overflow-auto scrollbar-xs"
                    >
                        {flatSuggestions.map((item, index) => {
                            let label, icon, href;

                            if (item.type === "project") {
                                const p = item.data;
                                href = formatUrl(
                                    `/properties/${p.city?.name}/${p.zone?.name}/${p.location?.name}/${p?.name}/${p?.id}`
                                );
                                label = p.name;
                                icon = <PiBuildingApartment />;
                            }

                            if (item.type === "location") {
                                const l = item.data;
                                href = `/listings?locationId=${l?.id}`;
                                label = l.name;
                                icon = <SlLocationPin />;
                            }

                            if (item.type === "builder") {
                                const b = item.data;
                                href = formatUrl(`/developer/${b.name}/${b?.id}`);
                                label = b.name;
                                icon = <BsBuildingFillGear />;
                            }

                            return (
                                <Link
                                    key={`${item.type}-${item?.data?.id}`}
                                    href={href}
                                    className=" flex items-center justify-between px-4 py-2 text-xs hover:bg-gray-100 transition"
                                    onClick={() => {
                                        setSearch(label);
                                        setSuggestions(emptySuggestions);
                                    }}
                                >
                                    <span className="font-medium text-gray-800">{label}</span>
                                    <span className="flex items-center gap-1 text-gray-500">
                                        {icon} {item.type}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchBar;

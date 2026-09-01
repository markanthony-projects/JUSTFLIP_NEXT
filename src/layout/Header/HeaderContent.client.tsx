"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Logo from "../../components/Logo/Logo";
import NearestCity from "@/src/components/NearestCity/NearestCity.client";
import { SEARCH_BAR_SLOT } from "../../components/SearchBar/search-bar.slot";
import { HEADER_PILL_SKIN } from "./header.config";

interface HeaderContentProps {
    searchBar: React.ReactNode;
}

export default function HeaderContent({ searchBar }: HeaderContentProps) {
    const pathname = usePathname();
    const isSearchPage = pathname?.startsWith("/search");

    return (
        <>
            {/* Logo: On search page on mobile, show the logo since the search bar is removed from the header */}
            <div className={`${isSearchPage ? "flex" : "hidden sm:flex"} items-center gap-4 shrink-0`}>
                <Logo priority />
                <div className="hidden lg:block">
                    <NearestCity buttonClassName={HEADER_PILL_SKIN} />
                </div>
            </div>

            {/* Header Search Bar: Hidden on mobile when on /search page to prevent duplicate search bars */}
            <div className={`${SEARCH_BAR_SLOT} top-1/2 -translate-y-1/2 ${isSearchPage ? "hidden sm:block" : ""}`}>
                {searchBar}
            </div>
        </>
    );
}

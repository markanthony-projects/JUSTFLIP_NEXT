import Logo from "../../components/Logo/Logo";
import NearestCity from "@/src/components/NearestCity/NearestCity.client";
import SearchBar from "../../components/SearchBar/SearchBar.server";
import { SEARCH_BAR_SLOT } from "../../components/SearchBar/search-bar.slot";
import BaseHeaderClient from "./BaseHeader.client";
import { HEADER_PILL_SKIN, HEADER_VARIANTS } from "./header.config";

export default function Header() {
    return (
        <BaseHeaderClient config={HEADER_VARIANTS.normal}>
            {/* Logo is desktop only — on mobile the bar is the search field alone.
                The city selector appears beside it only from `lg`, where there is
                room for it without crowding the centred search bar; below that it
                lives inside the bar itself. */}
            <div className="hidden sm:flex items-center gap-4 shrink-0">
                <Logo priority />
                <div className="hidden lg:block">
                    <NearestCity buttonClassName={HEADER_PILL_SKIN} />
                </div>
            </div>

            <div className={`${SEARCH_BAR_SLOT} top-1/2 -translate-y-1/2`}>
                <SearchBar />
            </div>
        </BaseHeaderClient>
    );
}

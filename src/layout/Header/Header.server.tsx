import SearchBar from "../../components/SearchBar/SearchBar.server";
import BaseHeaderClient from "./BaseHeader.client";
import HeaderContent from "./HeaderContent.client";
import { HEADER_VARIANTS } from "./header.config";

import { City } from "@/src/types";

export default function Header({ initialCity }: { initialCity?: City }) {
    return (
        <BaseHeaderClient config={HEADER_VARIANTS.normal}>
            <HeaderContent searchBar={<SearchBar initialCity={initialCity} />} initialCity={initialCity} />
        </BaseHeaderClient>
    );
}

import SearchBar from "../../components/SearchBar/SearchBar.server";
import BaseHeaderClient from "./BaseHeader.client";
import HeaderContent from "./HeaderContent.client";
import { HEADER_VARIANTS } from "./header.config";

export default function Header() {
    return (
        <BaseHeaderClient config={HEADER_VARIANTS.normal}>
            <HeaderContent searchBar={<SearchBar />} />
        </BaseHeaderClient>
    );
}

import Logo from "../../components/Logo/Logo";
import NearestCity from "@/src/components/NearestCity/NearestCity.server";
import SearchBar from "../../components/SearchBar/SearchBar.server";
import BaseHeaderClient from "./BaseHeader.client";
import { HEADER_VARIANTS } from "./header.config";

export default function Header() {
    return (
        <BaseHeaderClient config={HEADER_VARIANTS.normal} >
            <div className="flex items-center gap-4">
                <Logo />
                <NearestCity />
            </div>

            <div className="hidden md:block w-full lg:w-[500px] xl:w-[550px] md:w-[400px] ">
                <SearchBar />
            </div>

        </BaseHeaderClient>
    );
}

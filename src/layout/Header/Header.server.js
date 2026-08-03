import Logo from "../../components/Logo/Logo";
import NearestCity from "@/src/components/NearestCity/NearestCity.client";
import SearchBar from "../../components/SearchBar/SearchBar.server";
import BaseHeaderClient from "./BaseHeader.client";
import { HEADER_VARIANTS } from "./header.config";

export default function Header() {
    return (
        <BaseHeaderClient config={HEADER_VARIANTS.normal} >
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                <Logo className="w-[80px] h-[28px] sm:w-26 sm:h-10" />
                <div className="hidden sm:block shrink-0">
                    <NearestCity />
                </div>
            </div>

            <div className="flex-1 w-full min-w-0 sm:max-w-[300px] md:max-w-[400px] lg:max-w-[500px] xl:max-w-[550px] mr-auto md:mr-0 ml-3 sm:ml-4">
                <SearchBar />
            </div>
        </BaseHeaderClient>
    );
}

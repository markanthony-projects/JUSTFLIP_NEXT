import Image from "next/image";
import Logo from "../../components/Logo/Logo";
import NearestCity from "../../components/NearestCity/NearestCity.server";
import BaseHeaderClient from "./BaseHeader.client";
import { HEADER_VARIANTS } from "./header.config";
import logo from "@/public/assets/Justfliplogo.svg"

export default function InchargeHeader() {
    return (
        <BaseHeaderClient config={HEADER_VARIANTS.incharge}>
            <div className="flex-1 flex items-center gap-4">
                <Logo />
                <NearestCity />
            </div>

            <div className="w-full sm:w-[600px] lg:w-[450px] xl:w-[600px]" />
        </BaseHeaderClient>
    );
}

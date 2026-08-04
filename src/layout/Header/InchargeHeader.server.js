import Logo from "../../components/Logo/Logo";
import NearestCity from "../../components/NearestCity/NearestCity.client";
import BaseHeaderClient from "./BaseHeader.client";
import { HEADER_PILL_SKIN, HEADER_VARIANTS } from "./header.config";

export default function InchargeHeader() {
    return (
        <BaseHeaderClient config={HEADER_VARIANTS.incharge}>
            <div className="flex-1 flex items-center gap-4 min-w-0">
                <Logo priority />

                {/* Only from `lg`. Below that the hero search bar below carries
                    its own city selector, so a second one is redundant. */}
                <div className="hidden lg:block">
                    <NearestCity buttonClassName={HEADER_PILL_SKIN} />
                </div>
            </div>
        </BaseHeaderClient>
    );
}

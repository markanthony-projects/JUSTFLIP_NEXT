import JustflipService from "@/src/services/JustflipService";
import BannersClient from "./BannersClient";
import { preload } from "react-dom";

export default async function Banners() {

    const banners =
        await JustflipService.fetchBanners();

    if (!banners?.length) return null;

    // Preload first banner images to improve LCP resource load delay
    const firstBanner = banners[0];
    if (firstBanner) {
        if (firstBanner.meta?.mobileUrl) {
            preload(firstBanner.meta.mobileUrl, { as: "image", fetchPriority: "high" });
        }
        if (firstBanner.meta?.tabUrl) {
            preload(firstBanner.meta.tabUrl, { as: "image", fetchPriority: "high" });
        }
        if (firstBanner.url) {
            preload(firstBanner.url, { as: "image", fetchPriority: "high" });
        }
    }

    return (
        <section className="relative w-full aspect-square sm:aspect-[16/8] md:aspect-[16/6] lg:aspect-[16/5] overflow-hidden rounded-b-md shadow-xl bg-black">

            <BannersClient
                banners={banners}
            />

        </section>
    );

}
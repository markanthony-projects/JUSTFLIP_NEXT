import JustflipService from "@/src/services/JustflipService";
import BannersClient from "./BannersClient";

export default async function Banners() {

    const banners =
        await JustflipService.fetchBanners();

    if (!banners?.length) return null;

    return (
        <section className="relative w-full aspect-square sm:aspect-[16/8] md:aspect-[16/6] lg:aspect-[16/5] overflow-hidden rounded-b-md shadow-xl bg-black">

            <BannersClient
                banners={banners}
            />

        </section>
    );

}
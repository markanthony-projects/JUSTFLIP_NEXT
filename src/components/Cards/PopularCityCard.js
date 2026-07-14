import Link from "next/link";

import Image from "@/src/components/atoms/Image";

import { createCityUrl } from "@/src/utils/url";

export default function PopularCityCard({ city }) {

    if (!city) return null;

    const slug =
        createCityUrl(
            city?.name,
            city?.id
        );

    return (
        <Link
            href={slug}
            className="group block"
        >

            <div className="w-[240px] sm:w-[260px] md:w-[280px] rounded-2xl border border-gray-200 bg-white p-2.5 sm:p-3 transition-all duration-300 hover:border-gray-300 hover:shadow-lg">

                <div className="flex items-center gap-3 sm:gap-4">

                    {/* IMAGE */}

                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 overflow-hidden rounded-xl shrink-0 bg-gray-100">

                        <div className="w-full h-full transition-transform duration-500 group-hover:scale-[1.06]">

                            <Image
                                src={city?.banner}
                                alt={city?.name}
                                sizes="280px"
                                className="object-cover"
                            />

                        </div>

                    </div>

                    {/* CONTENT */}

                    <div className="min-w-0 flex-1">

                        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 leading-snug line-clamp-2">

                            {city?.name}

                        </h3>

                        <p className="mt-1 text-xs sm:text-sm text-gray-500">

                            {city?.projectCount > 0
                                ? `${city.projectCount.toLocaleString()}+ Properties`
                                : "No Properties"}

                        </p>

                    </div>

                </div>

            </div>

        </Link>
    );

}
import Link from "next/link";
import Image from "@/src/components/atoms/Image";
import { createCityUrl } from "@/src/utils/url";
import { City } from "@/src/types";

export interface PopularCityCardProps {
    city: City;
    priority?: boolean;
}

export default function PopularCityCard({ city, priority = false }: PopularCityCardProps) {
    if (!city) return null;

    const slug = createCityUrl(city.name, city.id as string);

    return (
        <Link
            href={slug}
            className="group block relative w-[240px] sm:w-[260px] md:w-[280px] h-36 sm:h-36 md:h-40 rounded-2xl overflow-hidden shadow-lg"
        >
            <Image
                src={city?.banner}
                alt={city?.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                priority={priority}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <h3 className="text-base sm:text-lg md:text-xl font-bold leading-snug line-clamp-2">
                    {city?.name}
                </h3>
                <p className="mt-1 text-xs sm:text-sm">
                    {city?.projectCount > 0
                        ? `${city.projectCount.toLocaleString()}+ Properties`
                        : "No Properties"}
                </p>
            </div>
        </Link>
    );
}
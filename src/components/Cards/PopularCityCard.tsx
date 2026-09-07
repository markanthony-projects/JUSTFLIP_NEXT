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
            className="group block relative w-[150px] md:w-[200px] h-24 md:h-30 rounded-lg overflow-hidden shadow-lg"
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
                <h3 className="text-base md:text-lg font-bold leading-snug line-clamp-2">
                    {city?.name}
                </h3>
                <p className="mt-0 md:mt-1 text-xs">
                    {city?.projectCount > 0
                        ? `${city.projectCount.toLocaleString()}+ Properties`
                        : "No Properties"}
                </p>
            </div>
        </Link>
    );
}
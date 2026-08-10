import Image from "@/src/components/atoms/Image";

import { Amenity } from "@/src/types";

export default function FeatureItem({ item }: { item: Amenity }) {
    return (
        <div className="py-0.5 px-1 lg:p-2 w-full sm:w-1/2 lg:w-1/4 flex items-start lg:items-center gap-2">
            {item?.image && (
                <div className="relative w-5 h-5 lg:w-6 lg:h-6 flex-shrink-0 mt-0.5 lg:mt-0">
                    <Image src={item.image} alt={item.name || "feature"} sizes="24px" className="object-contain" />
                </div>
            )}
            <span className="text-xs lg:text-sm text-gray-700 leading-tight lg:leading-normal">{item?.name}</span>
            <div className="border border-gray-300" />
        </div>
    );
}

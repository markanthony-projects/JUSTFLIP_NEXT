import Image from "@/src/components/atoms/Image";
import { Amenity } from "@/src/types";

export default function FeatureItem({ item }: { item: Amenity }) {
    return (
        <div className="flex items-center gap-3 p-3 w-full bg-white hover:bg-gray-50/80 border border-gray-100 rounded-lg transition-all duration-200">
            {item?.image && (
                <div className="relative w-8 h-8 flex-shrink-0 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg p-1.5">
                    <Image 
                        src={item.image} 
                        alt={item.name || "feature"} 
                        sizes="32px" 
                        className="object-contain" 
                    />
                </div>
            )}
            
            <span className="text-xs sm:text-sm font-medium text-gray-800 leading-snug">
                {item?.name}
            </span>
        </div>
    );
}
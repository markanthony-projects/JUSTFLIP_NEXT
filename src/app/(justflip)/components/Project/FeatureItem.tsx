// import Image from "@/src/components/atoms/Image";

// import { Amenity } from "@/src/types";

// export default function FeatureItem({ item }: { item: Amenity }) {
//     return (
//         <div className="py-0.5 px-1 lg:p-2 w-full sm:w-1/2 lg:w-1/4 flex items-start lg:items-center gap-2">
//             {item?.image && (
//                 <div className="relative w-5 h-5 lg:w-6 lg:h-6 flex-shrink-0 mt-0.5 lg:mt-0">
//                     <Image src={item.image} alt={item.name || "feature"} sizes="24px" className="object-contain" />
//                 </div>
//             )}
//             <span className="text-xs lg:text-sm text-gray-700 leading-tight lg:leading-normal">{item?.name}</span>
//             <div className="border border-gray-300" />
//         </div>
//     );
// }

import Image from "@/src/components/atoms/Image";
import { Amenity } from "@/src/types";

export default function FeatureItem({ item }: { item: Amenity }) {
    return (
        <div className="flex items-center gap-3 p-3 w-full bg-white hover:bg-gray-50/80 border border-gray-100 rounded-xl transition-all duration-200">
            {/* Icon Container with subtle background tint */}
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
            
            {/* Feature Name */}
            <span className="text-xs sm:text-sm font-medium text-gray-800 leading-snug">
                {item?.name}
            </span>
        </div>
    );
}
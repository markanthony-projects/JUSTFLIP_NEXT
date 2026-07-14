"use client";
import Image from "@/src/components/atoms/Image";

export default function ThumbnailList({ items = [], active, onSelect, }) {
    return (
        <div className="flex lg:w-fullflex gap-1 md:gap-3 overflow-x-auto w-full snap-x snap-mandatory scrollbar-hidden" >
            {items.map((item) => {
                const isActive = active?.url === item?.url;
                return (
                    <div key={item.id || item.url} className={`flex-shrink-0 w-30 md:w-32 h-18 md:h-20 rounded-lg p-0.5 overflow-hidden ${isActive ? "border-2 border-gray-700" : "opacity-60 scale-95 hover:opacity-100 hover:scale-100"}`}>
                        <button onClick={() => onSelect(item)} className="w-full h-full cursor-pointer transition-transform rounded-lg overflow-hidden " >
                            <Image src={item.url} alt={item.title || "thumbnail"} className="object-cover w-full h-full" />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
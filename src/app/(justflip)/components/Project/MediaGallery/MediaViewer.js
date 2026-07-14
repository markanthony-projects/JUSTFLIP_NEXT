"use client";
import Image from "@/src/components/atoms/Image";

export default function MediaViewer({ item }) {
    if (!item) return null;
    const label = item?.title || "media";

    if (item.type === "video") {
        return (
            <video controls className="max-h-full max-w-full rounded-xl" >
                <source src={item.url} />
            </video>
        );
    }

    return (
        <div className="relative w-full h-full rounded-lg overflow-hidden flex items-center justify-center">
            <div className="relative h-[222px] md:h-[404px] w-full md:w-[564px] flex items-center justify-center rounded-lg overflow-hidden bg-black  ">
                <Image
                    src={item?.url}
                    alt={label}
                    priority
                    sizes="(max-width: 768px) 100vw, 844px"
                    className="object-contain object-center cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
                />
            </div>
        </div>
    );
}
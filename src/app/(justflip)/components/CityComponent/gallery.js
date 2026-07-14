"use client";

import { useMemo, useState } from "react";
import Image from "@/src/components/atoms/Image";
import ImageGallery from "./galleryModal";

export default function Gallery({ data }) {
  const [isOpen, setIsOpen] = useState(false);

  const allImages = useMemo(() => {
    return (
      data?.medias?.filter((img) =>
        ["other", "others"].includes(img?.title?.toLowerCase?.())
      ) || []
    );
  }, [data]);

  const displayedImages = allImages.slice(0, 5);
  const remainingImages = allImages.slice(5);
  const first = displayedImages[0];

  if (!first?.url) return null;

  return (
    <section aria-label="Gallery" className="relative py-2">
      <h2 className="text-lg font-medium pb-2">Catch a Glimpse</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="w-full h-44 md:h-full rounded-lg overflow-hidden">
          <Image
            src={first?.url}
            alt={first?.alt || "main-image"}
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div className="relative">
          <div className="grid grid-cols-2 gap-2">
            {displayedImages.slice(1).map((img) => {
              if (!img?.url) return null;

              return (
                <div key={img.url} className="w-full h-28 md:h-44 rounded-lg overflow-hidden ">
                  <Image
                    src={img?.url}
                    alt={img?.alt || "gallery-image"}
                    className="object-cover "
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              );
            })}
          </div>

            <button
              type="button"
              aria-label="See all images"
              className="absolute bottom-2 cursor-pointer right-2 px-3 py-1 text-sm font-medium bg-white text-[#333] rounded-lg shadow hover:bg-gray-100"
              onClick={() => setIsOpen(true)}
            >
              See All
            </button>
    
        </div>
      </div>
      <ImageGallery images={allImages} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </section>
  );
}
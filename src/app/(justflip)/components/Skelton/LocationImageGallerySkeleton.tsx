"use client";

import { SkeletonBlock } from "./SkeletonSection";

export default function LocationImageGallerySkeleton() {
  return (
    <div className="animate-pulse">

      <SkeletonBlock className="h-5 w-56 mb-3" />

      <div className="w-full">
        <div className="bg-white rounded-lg">

          <div className="grid lg:grid-cols-6 grid-cols-1 lg:gap-2">

            {/* MAIN IMAGE */}
            <div className="col-span-4">
              <div className="relative w-full h-40 md:h-72 lg:h-96 rounded-lg overflow-hidden">
                <SkeletonBlock className="w-full h-full rounded-lg" />
              </div>
            </div>

            {/* THUMBNAILS */}
            <div className="col-span-2 w-full py-1 md:py-2 lg:py-0">

              <div className="lg:overflow-y-auto overflow-x-auto w-full">

                {/* MOBILE → horizontal scroll */}
                <div className="grid grid-flow-col auto-cols-max gap-2 lg:grid-cols-2 lg:grid-rows-3 lg:grid-flow-row">

                  {[1, 2, 3, 4, 5, 6].map((_, index) => (
                    <div
                      key={index}
                      className="relative rounded-lg p-[2px] overflow-hidden w-24 md:w-28 h-18 lg:w-full lg:h-24"
                    >
                      <SkeletonBlock className="w-full h-full rounded-lg" />
                    </div>
                  ))}

                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
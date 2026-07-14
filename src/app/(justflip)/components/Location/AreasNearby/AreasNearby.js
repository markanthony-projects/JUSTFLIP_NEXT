"use client";
import Link from "next/link";
import { MdKeyboardArrowRight } from "react-icons/md";
import Image from "@/src/components/atoms/Image";
import getStarTypes from "./getStarTypes";

export default function AreasNearby({ locationData }) {
  const locations = locationData?.nearbyLocations?.slice(0, 4) || [];
  return (
    <div>
      <h2 className="pb-4 text-lg font-medium">
        Areas Near by {locationData?.name}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {locations?.length > 0 ?
          locations?.map((loc) => {
            const rating = parseFloat(loc?.averageRating) || 0;
            const stars = getStarTypes(rating);

            return (
              <Link
                key={loc?.id}
                href={`properties/${locationData?.city?.name}/${locationData?.zone?.name}/${loc?.name}-${loc?.id}`}
                className="flex items-center gap-4 p-4 border border-gray-300 rounded-lg hover:shadow-md transition"
              >

                <div className="relative w-20 h-20">
                  <Image
                    src={loc?.["medias.url"]}
                    alt={loc?.["medias.alt"] || loc?.name}
                    fill
                    className="object-cover rounded-lg shadow-md"
                    priority
                  />
                </div>

                <div className="flex flex-col flex-grow">
                  <h3 className="text-sm font-medium text-[#333]">
                    {loc?.name}
                  </h3>

                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex">
                      {stars.map((type, index) => {
                        if (type === "full") {
                          return (
                            <svg key={index} viewBox="0 0 24 24" className="w-3 h-3 fill-[#C7A51C]">
                              <path d="M12 2l3 7 7 .5-5 4 1.5 7L12 17l-6.5 3.5L7 13 2 9.5 9 9z" />
                            </svg>
                          );
                        }
                        if (type === "half") {
                          return (
                            <svg key={index} viewBox="0 0 24 24" className="w-3 h-3">
                              <defs>
                                <linearGradient id={`half-${index}`}>
                                  <stop offset="50%" stopColor="#C7A51C" />
                                  <stop offset="50%" stopColor="white" />
                                </linearGradient>
                              </defs>
                              <path
                                fill={`url(#half-${index})`}
                                stroke="#C7A51C"
                                d="M12 2l3 7 7 .5-5 4 1.5 7L12 17l-6.5 3.5L7 13 2 9.5 9 9z"
                              />
                            </svg>
                          );
                        }
                        return (
                          <svg key={index} viewBox="0 0 24 24" className="w-3 h-3 stroke-[#C7A51C]">
                            <path fill="none" d="M12 2l3 7 7 .5-5 4 1.5 7L12 17l-6.5 3.5L7 13 2 9.5 9 9z" />
                          </svg>
                        );
                      })}
                    </div>

                    <p className="text-xs text-[#002B5B]">
                      ({loc?.totalReviews || 0} Reviews)
                    </p>
                  </div>
                </div>



                <MdKeyboardArrowRight className="text-gray-400 text-xl" />
              </Link>
            );
          }) : (
            <div className="flex justify-center h-20 items-center">
              <p className="text-sm text-gray-500  ">No nearby areas found.</p>
            </div>
          )}
      </div>
    </div>
  );
}
"use client";

import StarRating from "@/src/components/atoms/StarRating";
import { useMemo } from "react";

export default function AvgRating({ reviews = [] }) {
    return (
        <div className="md:px-2 md:border-r-2 md:border-gray-300 h-fit">
            {/* Average */}
            <div className="text-center">

                <h2 className="text-4xl font-semibold text-gray-900">
                    {reviews?.average}
                </h2>

                {/* Stars */}
                <div className="flex justify-center mt-1 gap-1">
                    <StarRating height={5} width={5} value={reviews?.average} />
                </div>


                <p className="text-sm text-gray-500 mt-1">
                    Based on{" "}
                    <span className="font-medium text-gray-700">
                        {reviews?.pagination?.totalReviews} reviews
                    </span>
                </p>

            </div>

            <div className="mt-6 space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                    const total = reviews?.pagination?.totalReviews || 0;
                    const count = reviews?.counts?.[rating] || 0;
                    const percentage = total > 0 ? (count / total) * 100 : 0;
                    return (
                        <div key={rating} className="flex items-center">
                            <span className="text-gray-600 w-6">{rating}</span>
                            <span className="text-[#D9A20D]"><svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="#D9A20D"
                                className="w-[12px] h-[12px] mb-1"
                            >
                                <path
                                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                />
                            </svg></span>
                            <div className="flex-1 mx-2 bg-gray-200 ">
                                <div
                                    className="h-[8px]"
                                    style={{
                                        backgroundColor:
                                            rating === 5
                                                ? "#54954E"
                                                : rating === 4
                                                    ? "#A9D350"
                                                    : rating === 3
                                                        ? "#EFE167"
                                                        : rating === 2
                                                            ? "#E2A93E"
                                                            : "#D9534F",
                                        width: `${percentage}%`,
                                    }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
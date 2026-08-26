"use client";

import { useState, useEffect, useMemo } from "react";
import ReviewsList from "@/src/components/organisms/ReviewsList";
import RatingModal from "@/src/components/organisms/RatingModal";
import LoginModal from "@/src/components/organisms/LoginModal";
import { useAuthStore } from "@/src/stores/auth.store";
import { useReviewStore, ReviewData } from "@/src/stores/review.store";
import { toast } from "@/src/utils/toast";
import { buildReviewsSchemaList } from "@/src/utils/schema";

export default function ReviewsSectionClient({ typeId, typeName, type, reviews: initialReviews }: { typeId: string | number; typeName: string; type: "city" | "zone" | "location" | "project"; reviews: any }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const { authType } = useAuthStore();
    
    const { setReviews, reviews: storeReviews } = useReviewStore();

    // Sync server-side reviews with client-side store on mount and prop change
    useEffect(() => {
        if (initialReviews) {
            setReviews(initialReviews as any);
        }
    }, [initialReviews, setReviews]);

    // Handle "city" specifically; everything else defaults to "project" behavior
    const isProject = type === "project";
    const entityLabel = type.charAt(0).toUpperCase() + type.slice(1);

    // Extract list of reviews for schema generation
    const reviewList = useMemo(() => {
        const revs = storeReviews?.reviews || initialReviews?.reviews || (Array.isArray(initialReviews) ? initialReviews : []);
        return Array.isArray(revs) ? revs : [];
    }, [storeReviews, initialReviews]);

    // Generate Review Schema (Google rich results)
    const reviewSchemas = useMemo(() => {
        if (!reviewList || reviewList.length === 0) return null;
        const itemType = type === "project" ? "RealEstateListing" : "Place";
        return buildReviewsSchemaList({
            itemReviewedName: typeName,
            itemReviewedType: itemType,
            reviews: reviewList,
        });
    }, [reviewList, type, typeName]);

    const handleRating = () => {
        if (authType === "visitor" || (!isProject && authType === "broker")){
            setModalOpen(true);
        } else if (authType === "broker"){
            toast.warn(`Only Buyers can leave ${entityLabel} review`);
        } else {
            setLoginOpen(true);
        }
    };
    
    return (
        <section className="">
            {reviewSchemas && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchemas) }}
                />
            )}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm md:text-lg font-semibold">Reviews</h2>
                {reviewList.length > 0 && (
                    <button onClick={handleRating} className="border-b text-sm">
                        Write a Review
                    </button>
                )}
            </div>

            {reviewList.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
                    <div className="bg-gradient-to-b from-gray-50 to-white rounded-xl border border-dashed border-gray-200 p-8 flex flex-col items-center justify-center">
                        
                        {/* Decorative Star Icon */}
                        <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 mb-3 shadow-inner">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                            </svg>
                        </div>

                        {/* Text and Description */}
                        <h4 className="text-base font-semibold text-gray-800 mb-1">No reviews yet</h4>
                        <p className="text-sm text-gray-500 mb-6 max-w-sm">No reviews available yet. Be the first one to review!</p>

                        {/* Action Button with Icon */}
                        <button 
                            onClick={handleRating} 
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#002B5B] hover:bg-[#002B5B] text-white font-medium text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                            </svg>
                            Write a Review
                        </button>
                    </div>
                </div>
            ) : (
                /* Use reviews from the store for real-time updates */
                <ReviewsList reviews={storeReviews} onWriteReview={handleRating}/>
            )}
            
            <RatingModal 
                typeName={typeName} 
                type={type} 
                typeId={typeId} 
                isOpen={modalOpen} 
                onClose={() => setModalOpen(false)} 
            />
            
            <LoginModal
                isOpen={loginOpen}
                closeModal={() => setLoginOpen(false)}
                onSuccess={() => {
                    const currentAuth = useAuthStore.getState().authType;
                    if (currentAuth === "visitor" || (!isProject && currentAuth === "broker")){
                        setModalOpen(true);
                    } else {
                        toast.warn(`Brokers are not eligible to leave ${entityLabel.toLowerCase()} reviews.`);
                    }
                }}
            />
        </section>
    );
}
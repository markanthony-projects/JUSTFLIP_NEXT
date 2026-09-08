"use client";

import { useState, useEffect, useMemo } from "react";
import ReviewsList from "@/src/components/organisms/ReviewsList";
import RatingModal from "@/src/components/organisms/RatingModal";
import LoginModal from "@/src/components/organisms/LoginModal";
import { useAuthStore } from "@/src/stores/auth.store";
import { useReviewStore } from "@/src/stores/review.store";
import { toast } from "@/src/utils/toast";
import { buildReviewsSchemaList } from "@/src/utils/schema";

export default function ReviewsSectionClient({ typeId, typeName, type, reviews: initialReviews }: { typeId: string | number; typeName: string; type: "city" | "zone" | "location" | "project"; reviews: any }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const { authType } = useAuthStore();
    
    const { setReviews, reviews: storeReviews } = useReviewStore();

    useEffect(() => {
        if (initialReviews) {
            setReviews(initialReviews as any);
        }
    }, [initialReviews, setReviews]);

    const isProject = type === "project";
    const entityLabel = type.charAt(0).toUpperCase() + type.slice(1);

    const reviewList = useMemo(() => {
        const revs = storeReviews?.reviews || initialReviews?.reviews || (Array.isArray(initialReviews) ? initialReviews : []);
        return Array.isArray(revs) ? revs : [];
    }, [storeReviews, initialReviews]);

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
        <section className="max-w-6xl mx-auto">
            {reviewSchemas && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchemas) }}
                />
            )}

            {/* Section Header */}
            <div className="flex justify-between items-center mb-6 gap-2">
                <div>
                    <h2 className="text-sm font-semibold mb-2 md:text-lg">Ratings & Reviews</h2>
                </div>
                <button 
                    onClick={handleRating} 
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 bg-primary hover:bg-primary text-white text-sm font-semibold rounded-lg cursor-pointer"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                    </svg>
                    Write a Review
                </button>
            </div>

            <ReviewsList reviews={storeReviews.reviews ? storeReviews : initialReviews} onWriteReview={handleRating}/>
            
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
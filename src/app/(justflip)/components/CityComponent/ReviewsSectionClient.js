"use client";

import { useState, useEffect } from "react";
import ReviewsList from "@/src/components/organisms/ReviewsList";
import RatingModal from "@/src/components/organisms/RatingModal";
import LoginModal from "@/src/components/organisms/LoginModal";
import { useAuthStore } from "@/src/stores/auth.store";
import { useReviewStore } from "@/src/stores/review.store";
import { toast } from "@/src/utils/toast";

export default function ReviewsSectionClient({ typeId, typeName, type, reviews: initialReviews }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const { authType } = useAuthStore();
    
    const { setReviews, reviews: storeReviews } = useReviewStore();

    // Sync server-side reviews with client-side store on mount and prop change
    useEffect(() => {
        if (initialReviews) {
            setReviews(initialReviews);
        }
    }, [initialReviews, setReviews]);

    // Handle "city" specifically; everything else defaults to "project" behavior
    const isCity = type === "city";
    const entityLabel = isCity ? "City" : "Project";

    const handleRating = () => {
        if (authType === "visitor" || (isCity && authType === "broker")){
            setModalOpen(true);
        } else if (authType === "broker"){
            toast.warn(`Only Buyers can leave ${entityLabel} review`);
        } else {
            setLoginOpen(true);
        }
    };
    
    return (
        <section className="">
            <div className="flex justify-between mb-4">
                <h2 className="text-lg font-semibold">Reviews</h2>
                <button onClick={handleRating} className="border-b text-sm">
                    Write a Review
                </button>
            </div>

            {/* Use reviews from the store for real-time updates */}
            <ReviewsList reviews={storeReviews} type={isCity ? "city" : "project"} />
            
            <RatingModal 
                typeName={typeName} 
                type={isCity ? "city" : "project"} 
                typeId={typeId} 
                isOpen={modalOpen} 
                onClose={() => setModalOpen(false)} 
            />
            
            <LoginModal
                isOpen={loginOpen}
                closeModal={() => setLoginOpen(false)}
                onSuccess={() => {
                    const currentAuth = useAuthStore.getState().authType;
                    if (currentAuth === "visitor" || (isCity && currentAuth === "broker")){
                        setModalOpen(true);
                    } else {
                        toast.warn(`Brokers are not eligible to leave ${entityLabel.toLowerCase()} reviews.`);
                    }
                }}
            />
        </section>
    );
}
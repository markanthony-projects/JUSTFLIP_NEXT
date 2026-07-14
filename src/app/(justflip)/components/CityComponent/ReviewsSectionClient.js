"use client";

import { useState, useEffect } from "react";
import ReviewsList from "@/src/components/organisms/ReviewsList";
import RatingModal from "@/src/components/organisms/RatingModal";
import LoginModal from "@/src/components/organisms/LoginModal";
import { useAuthStore } from "@/src/stores/auth.store";
import { useReviewStore } from "@/src/stores/review.store";

export default function ReviewsSectionClient({  typeId, typeName, type, reviews: initialReviews }) {
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

    const handleRating = () => {
        if (authType === "visitor" || authType === "broker") {
            setModalOpen(true)
        } else {
            setLoginOpen(true)
        }
    }
    
    return (
        <section className="">
            <div className="flex justify-between mb-4">
                <h2 className="text-lg font-semibold">Reviews</h2>
                <button onClick={handleRating} className="border-b text-sm">
                    Write a Review
                </button>
            </div>

            {/* Use reviews from the store for real-time updates */}
            <ReviewsList reviews={storeReviews} />
            <RatingModal typeName={typeName} type={type}  typeId={typeId} isOpen={modalOpen} onClose={() => setModalOpen(false)} />
            <LoginModal
                isOpen={loginOpen}
                closeModal={() => setLoginOpen(false)}
                onSuccess={() => setModalOpen(true)}
            />
        </section>
    );
}
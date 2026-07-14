"use client";

import Image from "@/src/components/atoms/Image";
import Modal from "@/src/components/organisms/Modal";

export default function FloorPlanModal({ isOpen, floorPlans, currentIndex, onClose, onNext, onPrev, }) {
    if (!isOpen) return null;

    const current = floorPlans[currentIndex];

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div >
                <h2 className="text-lg font-semibold text-center mb-4"> Floor Plan </h2>
                {current ? (
                    <>
                        <div className="relative w-full h-[300px]">
                            <Image src={current.url} alt={current.alt || "Floor Plan"} className="object-contain rounded" />
                        </div>

                        <p className="text-center mt-2 text-sm text-gray-600">
                            {current.alt || `Floor Plan ${currentIndex + 1}`}
                        </p>

                        {floorPlans.length > 1 && (
                            <div className="flex justify-between mt-4">
                                <button onClick={onPrev} className="bg-gray-200 px-4 py-2 rounded" > Previous </button>

                                <span className="text-sm">{currentIndex + 1} / {floorPlans.length}</span>

                                <button onClick={onNext}className="bg-gray-200 px-4 py-2 rounded"> Next </button>
                            </div>
                        )}
                    </>
                ) : (
                    <p className=" text-sm text-gray-500 min-h-[300px] justify-center flex items-center">
                        No floor plan available
                    </p>
                )}
            </div>
        </Modal>

    );
}
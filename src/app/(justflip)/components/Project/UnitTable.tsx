"use client";

import { useMemo, useState, useCallback } from "react";
import UnitRow from "./UnitRow";
import FloorPlanModal from "./FloorPlanModal";
import { convertToCurrency, getCurrencySymbol } from "@/src/utils/RenderFunction";

import { Project, Media } from "@/src/types";

export default function UnitTable({ project }: { project: Project }) {
    const [modalData, setModalData] = useState<{ isOpen: boolean, floorPlans: Media[], currentIndex: number }>({ isOpen: false, floorPlans: [], currentIndex: 0 });
    const parsedData = project?.units || [];

    const products = useMemo(() => {
        if (!parsedData?.length) return [];
        const getUnitNumber = (type: string) => parseFloat(type);

        return [...parsedData]
            .sort((a, b) => getUnitNumber(a.type) - getUnitNumber(b.type))
            .map((item) => ({
                category: item.type,
                minArea: item.interiorArea,
                maxArea: item.exteriorArea,
                minPrice: convertToCurrency(item?.minPrice, item?.currency),
                maxPrice: convertToCurrency(item?.maxPrice, item?.currency),
                currency: item?.currency || "INR",
                floorPlans: item.floorPlans || [],
            }));
    }, [parsedData]);

    const openModal = useCallback((floorPlans: Media[]) => {
        setModalData({ isOpen: true, floorPlans, currentIndex: 0, });
    }, []);

    const closeModal = useCallback(() => {
        setModalData({
            isOpen: false,
            floorPlans: [],
            currentIndex: 0,
        });
    }, []);

    const nextSlide = useCallback(() => {
        setModalData((prev) => ({
            ...prev,
            currentIndex:
                prev.currentIndex === prev.floorPlans.length - 1
                    ? 0
                    : prev.currentIndex + 1,
        }));
    }, []);

    const prevSlide = useCallback(() => {
        setModalData((prev) => ({
            ...prev,
            currentIndex:
                prev.currentIndex === 0
                    ? prev.floorPlans.length - 1
                    : prev.currentIndex - 1,
        }));
    }, []);

    return (
        <div className="w-full">
            
            <h2 className="text-sm font-semibold pb-2 pl-2 md:text-lg">
                Floor Plans & Pricing
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products?.map((product, index) => (
                    <UnitRow 
                        key={index} 
                        product={product} 
                        getCurrencySymbol={getCurrencySymbol} 
                        onView={() => openModal(product.floorPlans)} 
                    />
                ))}
            </div>
            

            <FloorPlanModal {...modalData} onClose={closeModal} onNext={nextSlide} onPrev={prevSlide} />
        </div>
    );
}
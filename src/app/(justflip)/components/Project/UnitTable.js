"use client";

import { useMemo, useState, useCallback } from "react";
import UnitRow from "./UnitRow";
import FloorPlanModal from "./FloorPlanModal";
import { convertToCurrency, getCurrencySymbol } from "@/src/utils/RenderFunction";

const headers = ["Unit Type", "Area", "Price", "Floor Plan"];

export default function UnitTable({ project }) {
    const [modalData, setModalData] = useState({ isOpen: false, floorPlans: [], currentIndex: 0 });
    const parsedData = project?.units || [];

    const products = useMemo(() => {
        if (!parsedData?.length) return [];
        const getUnitNumber = (type) => parseFloat(type);

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

    const openModal = useCallback((floorPlans) => {
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
        <div className="overflow-x-auto" >
            <div className="relative ">
                <table className="w-full text-left text-gray-600 overflow-y-auto">
                    <thead className="text-white bg-[#002B5B]">
                        <tr >
                            {headers?.map((header) => (
                                <th
                                    key={header}
                                    className="px-4 min-w-[150px]  py-3 text-sm font-semibold first:rounded-l last:rounded-r"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {products?.map((product, index) => (
                            <UnitRow key={index} product={product} getCurrencySymbol={getCurrencySymbol} onView={() => openModal(product.floorPlans)} />
                        ))}
                    </tbody>
                </table>
            </div>

            <FloorPlanModal {...modalData} onClose={closeModal} onNext={nextSlide} onPrev={prevSlide} />
        </div>
    );
}
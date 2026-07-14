"use client";

import { useState, useMemo, useCallback } from "react";
import FeatureItem from "./FeatureItem";
import ToggleButton from "@/src/components/atoms/ToggleButton";

export default function Features({ project }) {
    const [expanded, setExpanded] = useState(false);
    const amenities = project?.amenities || [];

    const visibleAmenities = useMemo(() => {
        return expanded ? amenities : amenities.slice(0, 8);
    }, [expanded, amenities]);

    const remainingCount = amenities.length - visibleAmenities.length;

    const toggle = useCallback(() => {
        setExpanded((prev) => !prev);
    }, []);

    if (!amenities.length) return null;

    return (
        <section className="">
            <h2 className="m-2 text-sm font-bold">Features</h2>

            <div className="flex flex-wrap m-2">
                {visibleAmenities.map((item, index) => (
                    <FeatureItem key={item?.id || index} item={item} />
                ))}
            </div>

            <div className="ml-4">
                <ToggleButton expanded={expanded} remainingCount={remainingCount} onToggle={toggle} />
            </div>
        </section>
    );
}
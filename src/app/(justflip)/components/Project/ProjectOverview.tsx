"use client";

import { useMemo, useState } from "react";
import ProjectOverviewItem from "./ProjectOverviewItem";
import {
    ProjectAreaIcon,
    SizesIcon,
    TotalUnitsIcon,
    AvgPriceIcon,
    PossessionIcon,
    ConfigurationsIcon,
} from "./ProjectOverviewIcons";
import { safeNumber, formatDate, getCurrencySymbol } from "@/src/utils/project.utils";
import { Project } from "@/src/types";

const MONTH_NAMES = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function ProjectOverview({ project }: { project: Project }) {
    const units = project?.units || [];
    const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

    const { avgPrice, interiorRange, configText } = useMemo(() => {
        if (!units.length) {
            return { avgPrice: 0, interiorRange: "-", configText: "-" };
        }
        const prices: number[] = [];
        const interiors: number[] = [];
        const unitNumbers = new Set<number>();
        let isOnRequest = false;
        let areaAvailable = false;

        for (const u of units) {
            const status = u?.priceStatus;
            const areaStatus = u?.areaStatus;
            if (status === "ON_REQUEST") isOnRequest = true;
            if (areaStatus === "AVAILABLE") areaAvailable = true;
            const price = safeNumber(u?.minPrice);
            const area = safeNumber(u?.interiorArea);
            if (price) prices.push(price);
            if (area) interiors.push(area);
            const match = u?.type?.match(/[\d.]+/);
            if (match) unitNumbers.add(parseFloat(match[0]));
        }

        const lowestPrice = prices.length ? Math.min(...prices) : 0;
        const minInterior = interiors.length ? Math.min(...interiors) : 0;
        const maxInterior = interiors.length ? Math.max(...interiors) : 0;
        const price = minInterior > 0 ? (lowestPrice / minInterior).toFixed(0) : 0;
        const avgPrice = isOnRequest ? "On Request" : price;
        const area = minInterior && maxInterior
            ? minInterior === maxInterior
                ? `${minInterior} sq.ft`
                : `${minInterior} - ${maxInterior} sq.ft`
            : "-";
        const interiorRange = areaAvailable ? area : "On Request";
        const lowerType = project?.type?.toLowerCase();
        let configText = "-";

        if (["plot", "pent house", "studio"].includes(lowerType)) {
            configText = [...new Set(units.map((u) => u?.type).filter(Boolean))].join(", ");
        } else {
            const sorted = [...unitNumbers].sort((a, b) => a - b);
            if (sorted.length) {
                configText = `${sorted.join(", ")} BHK`;
            }
        }
        return { avgPrice, interiorRange, configText };
    }, [units, project?.type]);

    const formattedDate = formatDate(project?.possessionDate);
    const { year, month } = typeof formattedDate === "object" && formattedDate !== null
        ? formattedDate
        : { year: null, month: null };

    const possessionText = useMemo(() => {
        if (!year) return "On Request";
        const monthNum = parseInt(String(month), 10);
        const m = !isNaN(monthNum) && monthNum >= 1 && monthNum <= 12
            ? MONTH_NAMES[monthNum - 1]
            : month;
        return m ? `${m} ${year}` : `${year}`;
    }, [year, month]);

    const currency = getCurrencySymbol(units as any);

    const landParcelValue = useMemo(() => {
        const val = parseFloat(project?.landParcel);
        return val > 0 ? `${project?.landParcel} Acres` : "On Request";
    }, [project?.landParcel]);

    const totalUnitsValue = useMemo(() => {
        if (!project?.totalUnits) return "On Request";
        return `${project.totalUnits} Units`;
    }, [project?.totalUnits]);

    const avgPriceValue = useMemo(() => {
        if (avgPrice === "On Request" || !avgPrice) return "On Request";
        return `${currency} ${avgPrice} / sq.ft`;
    }, [avgPrice, currency]);

    const hasSummary = Boolean(project?.summary && project.summary.trim().length > 0);
    const shouldTruncateSummary = hasSummary && (project.summary?.length ?? 0) > 260;

    return (
        <section>
            {/* Header */}
            <div className="mb-4 sm:mb-5">
                <h2 className="section-heading">
                    Project Overview
                </h2>
            </div>

            {/* Metric Card Tiles Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <ProjectOverviewItem
                    icon={<ProjectAreaIcon />}
                    label="Project Area"
                    value={landParcelValue}
                />

                <ProjectOverviewItem
                    icon={<SizesIcon />}
                    label="Sizes"
                    value={interiorRange}
                />

                <ProjectOverviewItem
                    icon={<TotalUnitsIcon />}
                    label="Total Units"
                    value={totalUnitsValue}
                />

                <ProjectOverviewItem
                    icon={<AvgPriceIcon />}
                    label="Avg. Price"
                    value={avgPriceValue}
                />

                <ProjectOverviewItem
                    icon={<PossessionIcon />}
                    label="Possession Starts"
                    value={possessionText}
                />

                <ProjectOverviewItem
                    icon={<ConfigurationsIcon />}
                    label="Configurations"
                    value={configText}
                />
            </div>

            {/* Optional Project Summary Narrative */}
            {hasSummary && (
                <div className="mt-5 pt-4 border-t border-gray-100">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                        About {project?.name || "the Project"}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        {shouldTruncateSummary && !isSummaryExpanded
                            ? `${project.summary?.slice(0, 260)}...`
                            : project.summary}
                    </p>
                    {shouldTruncateSummary && (
                        <button
                            type="button"
                            onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                            className="mt-1.5 text-xs font-semibold text-primary hover:underline focus:outline-none"
                        >
                            {isSummaryExpanded ? "Show Less" : "Read More"}
                        </button>
                    )}
                </div>
            )}
        </section>
    );
}

export default ProjectOverview;
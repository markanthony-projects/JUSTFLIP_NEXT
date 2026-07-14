"use client";
import { useMemo } from "react";
import ProjectOverviewItem from "./ProjectOverviewItem";
import { safeNumber, formatDate, getCurrencySymbol, } from "@/src/utils/project.utils";


function ProjectOverview({ project = {} }) {
    const units = project?.units || [];

    const { avgPrice, interiorRange, configText } = useMemo(() => {
        if (!units.length) { return { avgPrice: 0, interiorRange: "-", configText: "-", } }
        const prices = [];
        const interiors = [];
        const unitNumbers = new Set();

        for (const u of units) {
            const price = safeNumber(u?.minPrice);
            const area = safeNumber(u?.interiorArea);
            if (price) prices.push(price);
            if (area) interiors.push(area);
            const match = u?.type?.match(/[\d.]+/);
            if (match) unitNumbers.add(parseFloat(match[0]));
        }

        const lowestPrice = Math.min(...prices);
        const minInterior = Math.min(...interiors);
        const maxInterior = Math.max(...interiors);
        const avgPrice = minInterior > 0 ? (lowestPrice / minInterior).toFixed(0) : 0;
        const interiorRange = minInterior && maxInterior ? minInterior === maxInterior ? `${minInterior} sq.ft` : `${minInterior} - ${maxInterior} sq.ft` : "-";
        const lowerType = project?.type?.toLowerCase();
        let configText = "-";

        if (["plot", "pent house", "studio"].includes(lowerType)) {
            configText = [...new Set(units.map((u) => u?.type).filter(Boolean))].join(", ");
        } else {
            const sorted = [...unitNumbers].sort((a, b) => a - b);
            if (sorted.length) { configText = `${sorted.join(", ")} BHK` }
        }
        return { avgPrice, interiorRange, configText };
    }, [units, project?.type]);

    const { year, month, day } = formatDate(project?.possessionDate) || {};
    const currency = getCurrencySymbol(units);

    return (
        <section>
            <h2 className=" text-sm font-bold p-2">Project Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-white px-2 rounded-lg">
                <div className="flex items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="33"
                        viewBox="0 0 32 33"
                        fill="none"
                    >
                        <g clipPath="url(#clip0_96_6148)">
                            <path
                                d="M5.3335 15.1668V25.8335C5.3335 26.1871 5.47397 26.5263 5.72402 26.7763C5.97407 27.0264 6.31321 27.1668 6.66683 27.1668H17.3335M5.3335 8.50016V7.16683C5.3335 6.81321 5.47397 6.47407 5.72402 6.22402C5.97407 5.97397 6.31321 5.8335 6.66683 5.8335H8.00016M14.6668 5.8335H17.3335M24.0002 5.8335H25.3335C25.6871 5.8335 26.0263 5.97397 26.2763 6.22402C26.5264 6.47407 26.6668 6.81321 26.6668 7.16683V8.50016M26.6668 15.1668V17.8335M26.6668 24.5002V25.8335C26.6668 26.1871 26.5264 26.5263 26.2763 26.7763C26.0263 27.0264 25.6871 27.1668 25.3335 27.1668H24.0002"
                                stroke="black"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M5.3335 16.5H14.6668C15.0205 16.5 15.3596 16.6405 15.6096 16.8905C15.8597 17.1406 16.0002 17.4797 16.0002 17.8333V27.1667"
                                stroke="black"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </g>
                        <defs>
                            <clipPath id="clip0_96_6148">
                                <rect
                                    width="32"
                                    height="32"
                                    fill="white"
                                    transform="translate(0 0.5)"
                                />
                            </clipPath>
                        </defs>
                    </svg>
                    <ProjectOverviewItem label="Project Area" value={`${project?.landParcel || "-"} Acres`} />
                </div>
                <div className="flex items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="33"
                        height="33"
                        viewBox="0 0 33 33"
                        fill="none"
                    >
                        <g clipPath="url(#clip0_96_6165)">
                            <path
                                d="M7.16097 5.8335H25.8276C26.1813 5.8335 26.5204 5.97397 26.7704 6.22402C27.0205 6.47407 27.161 6.81321 27.161 7.16683V13.8335C27.161 14.1871 27.0205 14.5263 26.7704 14.7763C26.5204 15.0264 26.1813 15.1668 25.8276 15.1668H16.4943C16.1407 15.1668 15.8015 15.3073 15.5515 15.5574C15.3014 15.8074 15.161 16.1465 15.161 16.5002V25.8335C15.161 26.1871 15.0205 26.5263 14.7704 26.7763C14.5204 27.0264 14.1813 27.1668 13.8276 27.1668H7.16097C6.80735 27.1668 6.46821 27.0264 6.21816 26.7763C5.96811 26.5263 5.82764 26.1871 5.82764 25.8335V7.16683C5.82764 6.81321 5.96811 6.47407 6.21816 6.22402C6.46821 5.97397 6.80735 5.8335 7.16097 5.8335Z"
                                stroke="black"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M5.82764 11.1665H8.4943"
                                stroke="black"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M5.82764 16.5H9.82764"
                                stroke="black"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M5.82764 21.8335H8.4943"
                                stroke="black"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M11.1606 5.8335V8.50016"
                                stroke="black"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M16.4941 5.8335V9.8335"
                                stroke="black"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M21.8276 5.8335V8.50016"
                                stroke="black"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </g>
                        <defs>
                            <clipPath id="clip0_96_6165">
                                <rect
                                    width="32"
                                    height="32"
                                    fill="white"
                                    transform="translate(0.494141 0.5)"
                                />
                            </clipPath>
                        </defs>
                    </svg>
                    <ProjectOverviewItem label="Sizes" value={interiorRange} />
                </div>
                <div className="flex items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="33"
                        viewBox="0 0 32 33"
                        fill="none"
                    >
                        <g clipPath="url(#clip0_96_6191)">
                            <path
                                d="M17.3333 28.5V19.1667L10.6667 12.5L4 19.1667V28.5H10.6667M17.3333 28.5H10.6667M17.3333 28.5H28V5.83333C28 5.47971 27.8595 5.14057 27.6095 4.89052C27.3594 4.64048 27.0203 4.5 26.6667 4.5H13.3333C12.9797 4.5 12.6406 4.64048 12.3905 4.89052C12.1405 5.14057 12 5.47971 12 5.83333V13.8333M10.6667 28.5V23.1667"
                                stroke="black"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M17.3335 9.8335V9.84683"
                                stroke="black"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M22.6665 9.8335V9.84683"
                                stroke="black"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M22.6665 15.1665V15.1798"
                                stroke="black"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M22.6665 20.5V20.5133"
                                stroke="black"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </g>
                        <defs>
                            <clipPath id="clip0_96_6191">
                                <rect
                                    width="32"
                                    height="32"
                                    fill="white"
                                    transform="translate(0 0.5)"
                                />
                            </clipPath>
                        </defs>
                    </svg>
                    <ProjectOverviewItem label="Total Units" value={`${project?.totalUnits || 0} units`} />
                </div>
                <div className="flex items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="33"
                        viewBox="0 0 32 33"
                        fill="none"
                    >
                        <g clipPath="url(#clip0_96_6156)">
                            <path
                                d="M22.6668 11.1668V7.16683C22.6668 6.81321 22.5264 6.47407 22.2763 6.22402C22.0263 5.97397 21.6871 5.8335 21.3335 5.8335H8.00016C7.29292 5.8335 6.61464 6.11445 6.11454 6.61454C5.61445 7.11464 5.3335 7.79292 5.3335 8.50016M5.3335 8.50016C5.3335 9.20741 5.61445 9.88568 6.11454 10.3858C6.61464 10.8859 7.29292 11.1668 8.00016 11.1668H24.0002C24.3538 11.1668 24.6929 11.3073 24.943 11.5574C25.193 11.8074 25.3335 12.1465 25.3335 12.5002V16.5002M5.3335 8.50016V24.5002C5.3335 25.2074 5.61445 25.8857 6.11454 26.3858C6.61464 26.8859 7.29292 27.1668 8.00016 27.1668H24.0002C24.3538 27.1668 24.6929 27.0264 24.943 26.7763C25.193 26.5263 25.3335 26.1871 25.3335 25.8335V21.8335"
                                stroke="black"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M26.6665 16.5V21.8333H21.3332C20.6259 21.8333 19.9477 21.5524 19.4476 21.0523C18.9475 20.5522 18.6665 19.8739 18.6665 19.1667C18.6665 18.4594 18.9475 17.7811 19.4476 17.281C19.9477 16.781 20.6259 16.5 21.3332 16.5H26.6665Z"
                                stroke="black"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </g>
                        <defs>
                            <clipPath id="clip0_96_6156">
                                <rect
                                    width="32"
                                    height="32"
                                    fill="white"
                                    transform="translate(0 0.5)"
                                />
                            </clipPath>
                        </defs>
                    </svg>
                    <ProjectOverviewItem label="Avg. Price" value={`${currency} ${avgPrice} / sq.ft`} />
                </div>
                <div className="flex items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="33"
                        height="33"
                        viewBox="0 0 33 33"
                        fill="none"
                    >
                        <g clipPath="url(#clip0_96_6178)">
                            <path
                                d="M14.4943 28.4998H8.4943C7.78706 28.4998 7.10878 28.2189 6.60869 27.7188C6.10859 27.2187 5.82764 26.5404 5.82764 25.8332V9.83317C5.82764 9.12593 6.10859 8.44765 6.60869 7.94755C7.10878 7.44746 7.78706 7.1665 8.4943 7.1665H24.4943C25.2015 7.1665 25.8798 7.44746 26.3799 7.94755C26.88 8.44765 27.161 9.12593 27.161 9.83317V13.8332"
                                stroke="black"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M21.8276 4.5V9.83333"
                                stroke="black"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M11.1606 4.5V9.83333"
                                stroke="black"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M5.82764 15.1665H19.161"
                                stroke="black"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M19.1606 24.4998C19.1606 25.9143 19.7225 27.2709 20.7227 28.2711C21.7229 29.2713 23.0795 29.8332 24.494 29.8332C25.9085 29.8332 27.265 29.2713 28.2652 28.2711C29.2654 27.2709 29.8273 25.9143 29.8273 24.4998C29.8273 23.0853 29.2654 21.7288 28.2652 20.7286C27.265 19.7284 25.9085 19.1665 24.494 19.1665C23.0795 19.1665 21.7229 19.7284 20.7227 20.7286C19.7225 21.7288 19.1606 23.0853 19.1606 24.4998Z"
                                stroke="black"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M24.4941 22.5V24.5L25.1608 25.1667"
                                stroke="black"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </g>
                        <defs>
                            <clipPath id="clip0_96_6178">
                                <rect
                                    width="32"
                                    height="32"
                                    fill="white"
                                    transform="translate(0.494141 0.5)"
                                />
                            </clipPath>
                        </defs>
                    </svg>
                    <ProjectOverviewItem label="Possession Starts" value={year ? `${year}-${month}-${day}` : "-"} />
                </div>

                <div className="flex items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="33"
                        viewBox="0 0 32 33"
                        fill="none"
                    >
                        <g clipPath="url(#clip0_96_6202)">
                            <path
                                d="M4 23.1667L16 29.8333L28 23.1667V19.1667L16 25.8333L4 19.1667V15.1667L16 21.8333L28 15.1667V11.1667L16 17.8333L4 11.1667L16 4.5L23.224 8.51333"
                                stroke="black"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </g>
                        <defs>
                            <clipPath id="clip0_96_6202">
                                <rect
                                    width="32"
                                    height="32"
                                    fill="white"
                                    transform="translate(0 0.5)"
                                />
                            </clipPath>
                        </defs>
                    </svg>
                    <ProjectOverviewItem label="Configurations" value={configText} />
                </div>
            </div>
        </section>
    );
}

export default ProjectOverview;
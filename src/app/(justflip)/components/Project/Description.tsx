"use client";

import React, { useCallback, useMemo, useState } from "react";
import { AiOutlineWhatsApp } from "react-icons/ai";
import { FaFacebook, FaPlay } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { HiMapPin } from "react-icons/hi2";
import { MdOutlineApartment, MdVideoLibrary } from "react-icons/md";
import { PiBlueprint, PiShareFat } from "react-icons/pi";
import { TbPhotoSpark } from "react-icons/tb";
import { IoIosLink } from "react-icons/io";

import FavouriteButton from "@/src/components/atoms/FavouriteButton";
import FilterPopover from "@/src/components/atoms/FilterPopover";
import Image from "@/src/components/atoms/Image";
import MediaGallery from "@/src/components/atoms/MediaGallery";
import RERA from "@/src/components/atoms/RERA";
import LoginModal from "@/src/components/organisms/LoginModal";

import {
    formatDisplayPrice,
    getDefaultCurrencyFromUnits,
    getLowestAndHighestPrice,
} from "@/src/utils/RenderFunction";
import { toast } from "@/src/utils/toast";
import { createDeveloperDetailsUrl } from "@/src/utils/url";
import { Project } from "@/src/types";

// ---------------------------------------------------------------------------
// Pure data derivation helper
// ---------------------------------------------------------------------------
function derivePropertyData(properties: Project) {
    const units = properties?.units ?? [];
    const medias = properties?.medias ?? [];

    const { minPrice, maxPrice } = getLowestAndHighestPrice(units);
    const defaultCurrency = getDefaultCurrencyFromUnits(units, "INR");

    const uniqueSortedUnitTypes = [
        ...new Set(units.map((u) => u?.type).filter(Boolean)),
    ].sort((a, b) => parseFloat(a) - parseFloat(b));

    const toLower = (s: any) => (typeof s === "string" ? s.toLowerCase() : "");

    const { logo, banner, others_images, videos } = medias.reduce(
        (acc: any, item: any) => {
            const title = toLower(item.title);
            if (item.type === "video") {
                acc.videos.push(item);
            } else if (item.type === "image") {
                if (title === "logo") acc.logo = item;
                else if (title === "banner") acc.banner = item;
                else if (title === "other") acc.others_images.push(item);
            }
            return acc;
        },
        { logo: null, banner: null, others_images: [], videos: [] }
    );

    const allImages = medias.filter((m: any) => m.type === "image" && m.url);

    // Choose hero image: priority banner -> first other image -> first available image
    const heroImage = banner?.url || others_images[0]?.url || allImages[0]?.url || "";

    // For photo thumbnail in side column, pick second image if available, else first
    const photoThumbnailUrl =
        others_images.find((m: any) => m.url && m.url !== heroImage)?.url ||
        allImages.find((m: any) => m.url && m.url !== heroImage)?.url ||
        heroImage;

    const floorPlan = units.flatMap((u) => u?.floorPlans ?? []);
    const floorPlanFirst = floorPlan[0]?.url ?? "";

    const { lat = null, lng = null } = properties?.coordinates ?? {};

    const location: any = properties?.location ?? {};
    const zone: any = properties?.zone ?? {};
    const city: any = properties?.city ?? {};

    const locationParts = [
        location.name,
        zone.name ? `${zone.name}-${city.name || ""}` : city.name
    ].filter(Boolean);
    const address = locationParts.join(", ");

    const builderRaw: any = properties?.builder ?? {};
    const builder = {
        ...builderRaw,
        redirect: `/developer/${builderRaw.name}/${builderRaw.id}`,
    };

    const unitNumbers = uniqueSortedUnitTypes.map((u) =>
        u.replace(/BHK/i, "").trim()
    );
    const rawType = properties?.type ?? "";
    const propertyLabel =
        rawType.toLowerCase() === "plot"
            ? "Plots"
            : rawType.charAt(0).toUpperCase() + rawType.slice(1).toLowerCase() + "s";

    const unitSummaryLabel = unitNumbers.length
        ? `${unitNumbers.join(", ")} BHK ${propertyLabel}`
        : rawType
            ? `${rawType}s`
            : "";

    const isPriceOnRequest =
        !minPrice && !maxPrice && units?.some((u) => u.priceStatus === "ON_REQUEST");

    return {
        minPrice,
        maxPrice,
        defaultCurrency,
        uniqueSortedUnitTypes,
        others_images,
        allImages,
        heroImage,
        photoThumbnailUrl,
        floorPlan,
        floorPlanFirst,
        videos,
        banner,
        logo,
        lat,
        lng,
        address,
        builder,
        unitSummaryLabel,
        isPriceOnRequest,
    };
}

// ---------------------------------------------------------------------------
// Share button styling config
// ---------------------------------------------------------------------------
const SHARE_COLOR_MAP: Record<string, { btn: string; icon: string }> = {
    green: {
        btn: "hover:bg-emerald-50 text-gray-700 hover:text-emerald-700",
        icon: "bg-emerald-100 group-hover:bg-emerald-200 text-emerald-600",
    },
    blue: {
        btn: "hover:bg-blue-50 text-gray-700 hover:text-blue-700",
        icon: "bg-blue-100 group-hover:bg-blue-200 text-blue-600",
    },
    gray: {
        btn: "hover:bg-gray-100 text-gray-700",
        icon: "bg-gray-100 group-hover:bg-gray-200 text-gray-600",
    },
};

// ---------------------------------------------------------------------------
// Media thumbnail for side column
// ---------------------------------------------------------------------------
interface MediaThumbnailProps {
    imageUrl: string;
    alt: string;
    label: string;
    count?: number;
    Icon: React.ElementType;
    onClick: () => void;
    showPlay?: boolean;
}

function MediaThumbnail({
    imageUrl,
    alt,
    label,
    count,
    Icon,
    onClick,
    showPlay = false,
}: MediaThumbnailProps) {
    if (!imageUrl) return null;

    return (
        <div
            className="group cursor-pointer relative rounded-lg overflow-hidden flex-1 shadow-xs border border-white/20 transition-all duration-300 hover:shadow-md select-none"
            onClick={onClick}
        >
            <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110">
                <Image src={imageUrl} alt={alt} fill className="object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent transition-opacity group-hover:opacity-90" />

            {showPlay && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/25 backdrop-blur-md border border-white/40 flex items-center justify-center text-white transition-all duration-300 group-hover:scale-115 group-hover:bg-white/35 shadow-lg">
                        <FaPlay className="w-3.5 h-3.5 translate-x-0.5 text-white drop-shadow" />
                    </div>
                </div>
            )}

            <div className="w-full px-3 md:px-4 py-2.5 absolute bottom-0 flex items-center justify-between z-10">
                <span className="text-xs md:text-sm font-semibold text-white drop-shadow-sm tracking-wide">
                    {label}
                </span>
                {typeof count === "number" && count > 0 && (
                    <div className="flex items-center gap-1 text-[11px] md:text-xs font-semibold text-white bg-black/45 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20 shadow-xs">
                        <Icon className="text-xs" />
                        <span>{count}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Main Description Component
// ---------------------------------------------------------------------------
function Description({ project: properties }: { project: Project }) {
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState("images");

    const derived = useMemo(
        () => (properties ? derivePropertyData(properties) : null),
        [properties]
    );

    const handleGalleryOpen = useCallback((type = "images") => {
        setModalType(type);
        setOpenModal(true);
    }, []);

    const handleCopy = useCallback(() => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => toast.success("URL copied to clipboard"));
    }, []);

    const handleWhatsApp = useCallback(() => {
        const url = encodeURIComponent(window.location.href);
        window.open(`https://api.whatsapp.com/send?text=${url}`, "_blank", "noopener,noreferrer");
    }, []);

    const shareOptions = useMemo(
        () => [
            {
                id: "whatsapp",
                label: "WhatsApp",
                icon: <AiOutlineWhatsApp />,
                color: "green",
                onClick: handleWhatsApp,
            },
            {
                id: "facebook",
                label: "Facebook",
                icon: <FaFacebook />,
                color: "blue",
                onClick: () => { },
            },
            {
                id: "copy",
                label: "Copy Link",
                subLabel: "To Clipboard",
                icon: <IoIosLink />,
                color: "gray",
                onClick: handleCopy,
            },
        ],
        [handleWhatsApp, handleCopy]
    );

    if (!derived) return null;

    const {
        minPrice,
        maxPrice,
        defaultCurrency,
        others_images,
        allImages,
        heroImage,
        photoThumbnailUrl,
        floorPlan,
        floorPlanFirst,
        videos,
        logo,
        lat,
        lng,
        address,
        builder,
        unitSummaryLabel,
        isPriceOnRequest,
    } = derived;

    function isValidRera(rera?: string | null): boolean {
        if (!rera || typeof rera !== "string") return false;
        const normalized = rera.trim().toUpperCase();
        const invalidValues = [
            "NO RERA",
            "N/A",
            "NA",
            "NOT APPLICABLE",
            "NONE",
            "NOT REQUIRED",
            "NO_RERA",
        ];
        return !invalidValues.includes(normalized);
    }

    const mapsHref = `https://maps.google.com/maps?q=${lat},${lng}`;

    const priceText =
        minPrice === maxPrice
            ? formatDisplayPrice(minPrice, defaultCurrency)
            : `${formatDisplayPrice(minPrice, defaultCurrency)} – ${formatDisplayPrice(
                maxPrice,
                defaultCurrency
            )}`;

    const hasSideMedia = Boolean(photoThumbnailUrl || floorPlanFirst || videos?.length > 0);
    const totalPhotosCount = allImages.length || others_images.length;

    return (
        <section className="flex flex-col-reverse md:flex-col gap-4 mt-2 mb-6 w-full">
            {/* ── 1. Property Info Header (Desktop: Top, Mobile: Below Images) ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-gray-100/90 pb-4">
                {/* Left: Logo + Title + Badges + Address + Builder */}
                <div className="flex items-start md:items-center gap-3.5 min-w-0">
                    {/* Developer / Project Logo (Desktop only) */}
                    <div className="hidden md:flex relative w-16 h-16 rounded-lg bg-white border border-gray-200/80 p-1.5 shadow-xs shrink-0 items-center justify-center overflow-hidden hover:border-gray-300 transition-colors">
                        {logo?.url ? (
                            <Image
                                src={logo.url}
                                alt={logo.title || properties?.name || "Logo"}
                                fill
                                priority
                                className="object-contain p-1 rounded-lg"
                            />
                        ) : (
                            <MdOutlineApartment className="w-8 h-8 text-primary/70" />
                        )}
                    </div>

                    {/* Title + Metadata */}
                    <div className="flex flex-col gap-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2.5">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900 leading-snug">
                                {properties?.name}
                            </h1>
                            {isValidRera(properties?.rera) && (
                                <RERA
                                    rera={properties?.rera}
                                    labelClass="text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-2xs border border-emerald-300/80 !bg-emerald-50 text-emerald-800 hover:!bg-emerald-100 transition-colors"
                                />
                            )}
                        </div>

                        {/* Line 2: Address & View on Map */}
                        <div className="flex flex-wrap items-center gap-x-2.5 sm:gap-x-3 gap-y-1 text-xs md:text-sm text-gray-500">
                            {/* Address */}
                            <div className="flex items-center gap-1 text-gray-600 font-normal shrink-0">
                                <HiMapPin className="w-4 h-4 text-rose-500 shrink-0" />
                                <span>{address}</span>
                            </div>

                            {/* View on Map Pill */}
                            <a
                                href={mapsHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 bg-blue-50/80 hover:bg-blue-70/80 px-2.5 py-0.5 rounded-full border border-blue-100 transition-colors shrink-0"
                            >
                                <span>View on Map</span>
                                <FiExternalLink className="text-[11px]" />
                            </a>
                        </div>

                        {/* Line 3: Builder */}
                        {builder?.name && (
                            <div className="text-xs md:text-sm text-gray-500">
                                <span>By </span>
                                <a
                                    href={createDeveloperDetailsUrl(builder?.name, builder?.id)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-semibold text-gray-900 hover:text-primary transition-colors underline"
                                >
                                    {builder?.name}
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Price Showcase & BHK Tag */}
                <div className="flex flex-col items-start md:items-end justify-center shrink-0 min-w-max pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        PRICE RANGE
                    </span>
                    <div className="flex items-center justify-between w-full md:w-auto md:flex-col md:items-end gap-2">
                        <div className="text-2xl md:text-3xl font-extrabold text-gray-950 tracking-tight leading-none mt-0.5">
                            {isPriceOnRequest ? "Price on Request" : priceText}
                        </div>
                        {unitSummaryLabel && (
                            <div className="md:mt-1.5 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100/90 text-gray-700 border border-gray-200/60">
                                <span>{unitSummaryLabel}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── 2. Media Gallery Grid ─────────────────────────────────── */}
            <div className="flex flex-col md:flex-row gap-2.5 md:gap-3 w-full h-auto md:h-[500px] lg:h-[540px]">
                {/* Primary Hero Image */}
                <div
                    className={`group relative rounded-lg overflow-hidden cursor-pointer select-none aspect-[4/3] sm:aspect-[16/10] md:aspect-auto ${hasSideMedia ? "w-full md:flex-[3.2] md:h-full" : "w-full md:h-full"
                        }`}
                    onClick={() => handleGalleryOpen("images")}
                >
                    <div className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-105">
                        <Image
                            src={heroImage}
                            alt={properties?.name || "Property Image"}
                            fill
                            priority
                            className="object-cover"
                        />
                    </div>

                    {/* Subtle Vignette Gradient for Contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25 pointer-events-none" />

                    {/* Floating Actions: Share & Favorite */}
                    <div
                        className="absolute top-3 right-3 md:top-4 md:right-4 flex items-center gap-2 z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <FilterPopover
                            buttonPrefixIcon={<PiShareFat className="text-sm" />}
                            label="Share"
                            showDropdownArrow={false}
                            buttonClass="backdrop-blur-md bg-white/90 hover:bg-white text-gray-800 text-xs px-3.5 py-1.5 rounded-full shadow-md border border-white/60 font-semibold transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer"
                        >
                            <div className="bg-white flex flex-col min-w-[210px] md:min-w-[240px] p-1.5 rounded-lg shadow-xl border border-gray-100">
                                <div className="text-center py-1">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                        Share Property
                                    </span>
                                </div>
                                <span className="border-t border-gray-100 my-1" />

                                <div className="flex flex-col gap-1">
                                    {shareOptions.map((option) => {
                                        const colors = SHARE_COLOR_MAP[option.color];
                                        return (
                                            <React.Fragment key={option.id}>
                                                {option.id === "copy" && (
                                                    <div className="my-1 border-t border-gray-100" />
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={option.onClick}
                                                    className={`group/btn flex items-center justify-between w-full p-2 rounded-lg transition-all text-left ${colors.btn}`}
                                                >
                                                    <div className="flex items-center gap-2.5">
                                                        <div
                                                            className={`p-1.5 rounded-full transition-colors ${colors.icon}`}
                                                        >
                                                            {React.cloneElement(option.icon, {
                                                                className: "w-4 h-4",
                                                            })}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <p className="text-xs font-semibold leading-tight">
                                                                {option.label}
                                                            </p>
                                                            {option.subLabel && (
                                                                <p className="text-[10px] text-gray-400 leading-tight mt-0.5">
                                                                    {option.subLabel}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {option.id !== "copy" && (
                                                        <span className="text-gray-300 group-hover/btn:translate-x-0.5 transition-transform text-xs">
                                                            ➜
                                                        </span>
                                                    )}
                                                </button>
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                            </div>
                        </FilterPopover>

                        <FavouriteButton
                            project={properties}
                            onAuthRequired={() => setShowLoginPrompt(true)}
                            className="backdrop-blur-md bg-white/90 hover:bg-white text-gray-800 text-xs px-3 py-1.5 rounded-full shadow-md border border-white/60 font-semibold transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-1 cursor-pointer"
                        />
                    </div>

                    {/* Floating "View All Photos" Pill */}
                    {totalPhotosCount > 0 && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleGalleryOpen("images");
                            }}
                            className="absolute bottom-3 left-3 md:bottom-4 md:left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/55 hover:bg-black/75 backdrop-blur-md text-white text-xs font-medium border border-white/20 transition-all duration-200 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                        >
                            <TbPhotoSpark className="text-sm text-amber-300" />
                            <span>View Photos ({totalPhotosCount})</span>
                        </button>
                    )}
                </div>

                {/* Side Thumbnails Column */}
                {hasSideMedia && (
                    <div className="flex flex-row md:flex-col gap-2 md:gap-2.5 w-full md:flex-1 h-[125px] sm:h-[145px] md:h-full">
                        {/* All Photos Thumbnail */}
                        {photoThumbnailUrl && (
                            <MediaThumbnail
                                imageUrl={photoThumbnailUrl}
                                alt="All Photos"
                                label="Photos"
                                count={totalPhotosCount}
                                Icon={TbPhotoSpark}
                                onClick={() => handleGalleryOpen("images")}
                            />
                        )}

                        {/* Videos Thumbnail */}
                        {videos?.length > 0 && (
                            <MediaThumbnail
                                imageUrl={videos[0]?.thumbnailUrl || heroImage}
                                alt="Videos"
                                label="Videos"
                                count={videos.length}
                                Icon={MdVideoLibrary}
                                showPlay={true}
                                onClick={() => handleGalleryOpen("video")}
                            />
                        )}

                        {/* Floor Plans Thumbnail */}
                        {floorPlanFirst && (
                            <MediaThumbnail
                                imageUrl={floorPlanFirst}
                                alt="Floor Plans"
                                label="Floor Plans"
                                count={floorPlan?.length ?? 0}
                                Icon={PiBlueprint}
                                onClick={() => handleGalleryOpen("floor")}
                            />
                        )}
                    </div>
                )}
            </div>

            {/* ── 3. Modals ─────────────────────────────────────────────── */}
            <MediaGallery
                modalType={modalType}
                properties={properties}
                open={openModal}
                closeModal={() => setOpenModal(false)}
            />

            <LoginModal
                isOpen={showLoginPrompt}
                closeModal={() => setShowLoginPrompt(false)}
            />
        </section>
    );
}

export default React.memo(Description);
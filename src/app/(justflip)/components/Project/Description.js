// "use client";

// import React, { useMemo, useCallback, useState } from "react";
// import Image from "@/src/components/atoms/Image";
// import { TbShare2 } from "react-icons/tb";
// import { IoCopyOutline } from "react-icons/io5";
// import { BiLogoWhatsapp } from "react-icons/bi";
// import { formatDisplayPrice, getDefaultCurrencyFromUnits, getLowestAndHighestPrice } from "@/src/utils/RenderFunction";
// import { toast } from "@/src/utils/toast";
// import ActionButton from "@/src/components/atoms/ActionButton";
// import LoginModal from "@/src/components/organisms/LoginModal";
// import FavouriteButton from "@/src/components/atoms/FavouriteButton";

// const WHATSAPP_NUMBER = "918431362126";

// function Description({ project }) {
//     const [loginOpen, setLoginOpen] = useState(false);

//     if (!project) return null;

//     const currentUrl = typeof window !== "undefined" ? window.location.href : "";

//     const logo = useMemo(() => {
//         return project?.medias?.find((o) => o?.type === "image") || null;
//     }, [project?.medias]);

//     const unitTypes = useMemo(() => {
//         if (!project?.units?.length) return [];
//         return [...new Set(project.units.map((unit) => unit?.type).filter(Boolean))].sort((a, b) => parseFloat(a) - parseFloat(b));
//     }, [project?.units]);

//     const { minPrice, maxPrice } = useMemo(() => {
//         return getLowestAndHighestPrice(project?.units || []);
//     }, [project?.units]);

//     const currency = useMemo(() => {
//         return getDefaultCurrencyFromUnits(project?.units || [], "INR");
//     }, [project?.units]);

//     const priceText = useMemo(() => {
//         if (minPrice == null) return null;
//         return minPrice === maxPrice ? formatDisplayPrice(minPrice, currency) : `${formatDisplayPrice(minPrice, currency)} - ${formatDisplayPrice(maxPrice, currency)}`;
//     }, [minPrice, maxPrice, currency]);


//     const handleWhatsApp = useCallback(() => {
//         if (!currentUrl) return;
//         const link = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(currentUrl)}`;
//         window.open(link, "_blank", "noopener,noreferrer");
//     }, [currentUrl]);

//     const handleShare = useCallback(async () => {
//         try {
//             if (navigator.share) {
//                 await navigator.share({ title: project?.name || "Property", url: currentUrl, });

//             } else {
//                 await navigator.clipboard.writeText(currentUrl);
//                 toast.success("Link copied!");
//             }
//         } catch (err) {
//             console.error("Share failed:", err)
//         }
//     }, [currentUrl, project?.name]);

//     const handleCopy = useCallback(async () => {
//         try {
//             await navigator.clipboard.writeText(currentUrl);
//             toast.success("Copied to clipboard");
//         } catch (err) {
//             console.error(err);
//         }
//     }, [currentUrl]);


//     return (
//         <div className="w-full py-2">
//             <div className="grid grid-cols-1 md:grid-cols-2">
//                 <div className="flex items-center gap-3 h-auto md:h-[75px]">

//                     <div className="relative w-[75px] h-[75px] border-gray-50 rounded-sm p-1 shadow overflow-hidden">
//                         <Image
//                             src={logo?.url}
//                             alt={logo?.title || project?.name || "Property"}
//                             priority
//                             className={'rounded-sm'}
//                         />
//                     </div>

//                     <div className="flex flex-col">
//                         <h1 className="text-black text-base font-semibold">
//                             {project?.name || "Unnamed Project"}
//                         </h1>

//                         <p className="text-[12px] text-gray-600">
//                             {unitTypes.join(", ")}{" "}
//                             {project?.type?.toLowerCase() !== "plot" && project?.type}
//                         </p>

//                         {priceText && (
//                             <div>
//                                 <span className="mt-1 inline-block bg-[#002B5B] text-white text-sm px-3 py-1 rounded-md font-medium">
//                                     {priceText}
//                                 </span>
//                             </div>

//                         )}
//                     </div>
//                 </div>

//                 <div className="hidden md:flex justify-end items-end ">
//                     <div className="flex border rounded-md  divide-x">
//                         <ActionButton
//                             label="WhatsApp"
//                             onClick={handleWhatsApp}
//                             icon={<BiLogoWhatsapp />}
//                         />

//                         <ActionButton
//                             label="Share"
//                             onClick={handleShare}
//                             icon={<TbShare2 />}
//                         />

//                         <ActionButton
//                             label="Copy"
//                             onClick={handleCopy}
//                             icon={<IoCopyOutline />}
//                         />

//                         <FavouriteButton
//                             project={project}
//                             onAuthRequired={() => setLoginOpen(true)}
//                             className="relative px-4 py-2 flex items-center justify-center text-[#002B5B] cursor-pointer overflow-visible transition-all duration-300 ease-out active:scale-95"
//                         />
//                     </div>
//                 </div>
//             </div>

//             <LoginModal isOpen={loginOpen} closeModal={() => setLoginOpen(false)} />
//         </div>
//     );
// }

// export default React.memo(Description);


"use client";

import React, { useCallback, useMemo, useState } from "react";
import { AiOutlineWhatsApp } from "react-icons/ai";
import { FaFacebook } from "react-icons/fa";
import { MdLocationOn, MdVideoLibrary } from "react-icons/md";
import { PiBlueprint, PiShareFat } from "react-icons/pi";
import { TbPhotoSpark } from "react-icons/tb";

import FavouriteButton from "@/src/components/atoms/FavouriteButton";
import FilterPopover from "@/src/components/atoms/FilterPopover";
import Image from "@/src/components/atoms/Image";
import MediaGallery from "@/src/components/atoms/MediaGallery";
import RERA from "@/src/components/atoms/RERA";
import LoginModal from "@/src/components/organisms/LoginModal";

import { formatDisplayPrice, getDefaultCurrencyFromUnits, getLowestAndHighestPrice, } from "@/src/utils/RenderFunction";
import { toast } from "@/src/utils/toast";
import { IoIosLink } from "react-icons/io";

// ---------------------------------------------------------------------------
// Pure helper — runs once per properties change, no hooks involved
// ---------------------------------------------------------------------------
function derivePropertyData(properties) {
    const units = properties?.units ?? [];
    const medias = properties?.medias ?? [];

    const { minPrice, maxPrice } = getLowestAndHighestPrice(units);
    const defaultCurrency = getDefaultCurrencyFromUnits(units, "INR");

    const uniqueSortedUnitTypes = [
        ...new Set(units.map((u) => u?.type).filter(Boolean)),
    ].sort((a, b) => parseFloat(a) - parseFloat(b));

    const toLower = (s) => (typeof s === "string" ? s.toLowerCase() : "");

    const { logo, banner, others_images, videos } = medias.reduce(
        (acc, item) => {
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

    const allImages = medias.filter(m => m.type === 'image');
    
    const primaryImageUrl = banner?.url || others_images[0]?.url || allImages[0]?.url || "";
    
    const remainingImages = allImages.filter(m => m.url !== primaryImageUrl);
    const secondaryImageUrl = remainingImages[0]?.url || "";
    const thirdImageUrl = remainingImages[1]?.url || "";

    const floorPlan = units.flatMap((u) => u?.floorPlans ?? []);
    const floorPlanFirst = floorPlan[0]?.url ?? "";

    const { lat = null, lng = null } = properties?.coordinates ?? {};

    const location = properties?.location ?? {};
    const zone = properties?.zone ?? {};
    const city = properties?.city ?? {};
    const address = `${location.name}, ${zone.name}-${city.name}`;

    const builderRaw = properties?.builder ?? {};
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
    const unitSummaryLabel = `${unitNumbers.join(", ")} BHK ${propertyLabel}`;

    return {
        minPrice, maxPrice, defaultCurrency,
        uniqueSortedUnitTypes, others_images: allImages,
        primaryImageUrl, secondaryImageUrl, thirdImageUrl,
        floorPlan, floorPlanFirst,
        videos, banner, logo,
        lat, lng, address, builder, unitSummaryLabel,
    };
}

// ---------------------------------------------------------------------------
// Small presentational sub-components
// ---------------------------------------------------------------------------

/** One clickable tile in the right-hand media strip */
function MediaThumbnail({ imageUrl, alt, label, count, Icon, onClick }) {
    return (
        <div
            className="group cursor-pointer relative rounded-sm overflow-hidden flex-1"
            onClick={onClick}
        >
            <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
                <Image src={imageUrl} alt={alt} fill className="object-cover" />
            </div>
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            <div className="w-full px-3 md:px-6 py-2 absolute bottom-0 flex items-center justify-between z-10">
                <span className="text-[10px] md:text-sm font-medium text-white">{label}</span>
                <div className="flex items-center gap-1 text-[10px] md:text-sm text-white">
                    <Icon />
                    <span>{count}</span>
                </div>
            </div>
        </div>
    );
}

// Icon colour config kept outside render to avoid re-creation
const SHARE_COLOR_MAP = {
    green: {
        btn: "hover:bg-green-50 text-gray-700 hover:text-green-700",
        icon: "bg-green-100 group-hover:bg-green-200 text-green-600",
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
// Main component
// ---------------------------------------------------------------------------
function Description({ project: properties }) {
    // ── Early-return guard BEFORE any hooks ────────────────────────────────
    // We derive data synchronously so we can still do the early return
    // while keeping all useState/useCallback below unconditional.
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

    // Build share options inside useMemo so icons aren't recreated every render
    const shareOptions = useMemo(() => [
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
    ], [handleWhatsApp, handleCopy]);

    const {
        minPrice, maxPrice, defaultCurrency,
        others_images, primaryImageUrl, secondaryImageUrl, thirdImageUrl,
        floorPlan, floorPlanFirst,
        videos, logo,
        lat, lng, address, builder, unitSummaryLabel,
    } = derived;

    const mapsHref = `https://maps.google.com/maps?q=${lat},${lng}`;

    const priceText =
        minPrice === maxPrice
            ? formatDisplayPrice(minPrice, defaultCurrency)
            : `${formatDisplayPrice(minPrice, defaultCurrency)} – ${formatDisplayPrice(maxPrice, defaultCurrency)}`;

    return (
        <main className="flex flex-col-reverse md:flex-col gap-4 mt-2 mb-4 md:mb-8">

            {/* ── Property info bar ──────────────────────────────────────── */}
            <div className="flex flex-col justify-between md:flex-row md:items-center px-3 py-2 md:p-0 gap-4 md:shadow-none rounded-lg bg-gray-100 md:bg-white">

                {/* Mobile-only: map link + RERA */}
                <div className="flex md:hidden items-center justify-between gap-2">
                    <a
                        href={mapsHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 flex items-center gap-1 rounded-sm text-xs font-medium border border-gray-200 bg-black/10"
                    >
                        See on map 📌
                    </a>
                    <RERA rera={properties?.rera} labelClass="text-[10px] px-2 py-0.5 rounded-sm" />
                </div>

                {/* Logo + name + address + builder */}
                <div className="flex gap-2">
                    <div
                        className={`hidden md:flex items-center justify-center relative p-1 w-[75px] h-[75px] overflow-hidden border border-gray-100 rounded-sm shadow-lg ${!logo?.url ? "animate-pulse bg-gray-200" : ""}`}
                    >
                        {logo?.url && (
                            <Image
                                src={logo.url}
                                alt={logo.title || "Property Logo"}
                                fill
                                priority
                                className="rounded-sm object-cover"
                            />
                        )}
                    </div>

                    <div className="flex flex-col justify-between">
                        <div className="flex items-center gap-2">
                            <h1 className="text-black font-semibold text-xl p-0 m-0">
                                {properties?.name}
                            </h1>
                            <div className="relative hidden md:block">
                                <RERA rera={properties?.rera} labelClass="text-[10px] px-2 py-0.5 rounded-sm" />
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <MdLocationOn className="w-4 aspect-square text-gray-500" />
                            <span className="text-gray-500 text-xs font-light">{address}</span>
                            <a
                                href={mapsHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hidden md:flex items-center ml-1 text-blue-600 text-xs cursor-pointer"
                            >
                                (Open In Map 📌)
                            </a>
                        </div>

                        <span>
                            <span className="text-sm">By </span>
                            <a
                                href={builder?.redirect}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium text-blue-500 underline"
                            >
                                {builder?.name}
                            </a>
                        </span>
                    </div>
                </div>

                {/* Price range */}
                <div className="text-left md:text-right flex flex-col">
                    <p className="text-xs text-gray-400">PRICE RANGE</p>
                    <p className="text-xl font-medium">{priceText}</p>
                    <span className="text-sm text-gray-600 font-light">{unitSummaryLabel}</span>
                </div>
            </div>

            {/* ── Image gallery grid ─────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row gap-2 w-full">

                {/* Primary (hero) image */}
                <div className="group relative rounded-sm overflow-hidden w-full md:flex-[2] aspect-video">
                    <div className="transition-transform duration-500 group-hover:scale-105 w-full h-full">
                        <Image
                            src={primaryImageUrl}
                            alt={properties?.name}
                            fill
                            priority
                            className="object-cover"
                        />
                    </div>

                    {/* Share popover + Save button */}
                    <div className="absolute top-2 right-2 md:top-4 md:right-4 flex items-center gap-2 z-10">
                        <FilterPopover
                            buttonPrefixIcon={<PiShareFat className="text-xs md:text-sm" />}
                            label="SHARE"
                            showDropdownArrow={false}
                            buttonClass="bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] md:text-xs px-2 py-1 md:px-3 md:py-1.5 rounded-sm shadow-sm font-bold"
                        >
                            <div className="bg-white flex flex-col min-w-[200px] md:min-w-[240px]">
                                <div className="text-center pb-0.5 md:pb-1">
                                    <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                        SHARE THIS PROPERTY
                                    </span>
                                </div>
                                <span className="border border-gray-100 my-0.5" />

                                <div className="flex flex-col gap-0.5 md:gap-1">
                                    {shareOptions.map((option) => {
                                        const colors = SHARE_COLOR_MAP[option.color];
                                        return (
                                            <React.Fragment key={option.id}>
                                                {option.id === "copy" && (
                                                    <div className="my-1 border-t border-gray-50 mx-2" />
                                                )}
                                                <button
                                                    onClick={option.onClick}
                                                    className={`group flex items-center justify-between w-full p-1 md:p-1.5 rounded-md transition-all ${colors.btn}`}
                                                >
                                                    <div className="flex items-center gap-2 md:gap-3 text-left">
                                                        <div className={`p-1.5 md:p-2 rounded-full transition-colors ${colors.icon}`}>
                                                            {React.cloneElement(option.icon, {
                                                                className: "w-[14px] h-[14px] md:w-[18px] md:h-[18px]",
                                                            })}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <p className="text-xs md:text-sm font-medium leading-none">
                                                                {option.label}
                                                            </p>
                                                            {option.subLabel && (
                                                                <p className="text-[8px] md:text-[10px] text-gray-400 mt-0.5 md:mt-1 uppercase tracking-tight leading-none">
                                                                    {option.subLabel}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {option.id !== "copy" && (
                                                        <span className="text-gray-300 group-hover:translate-x-0.5 transition-transform text-[10px] md:text-xs">
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
                            className="flex items-center gap-1 bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] md:text-xs px-2 py-1 md:px-3 md:py-1.5 rounded-sm shadow-sm font-bold"
                        />
                    </div>
                </div>

                {/* Right-hand media strip */}
                {(secondaryImageUrl || floorPlanFirst || videos?.length > 0) && (
                    <div className="flex flex-row md:flex-col gap-2 w-full md:flex-1 h-[100px] sm:h-[120px] md:h-auto">

                        {secondaryImageUrl && (
                            <MediaThumbnail
                                imageUrl={secondaryImageUrl}
                                alt="All Photos"
                                label="All Photos"
                                count={others_images?.length ?? 0}
                                Icon={TbPhotoSpark}
                                onClick={() => handleGalleryOpen("images")}
                            />
                        )}

                        {videos?.length > 0 && (
                            <MediaThumbnail
                                imageUrl={videos[0]?.url}
                                alt="Videos"
                                label="Videos"
                                count={videos.length}
                                Icon={MdVideoLibrary}
                                onClick={() => handleGalleryOpen("video")}
                            />
                        )}

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

            {/* ── Modals ────────────────────────────────────────────────── */}
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
        </main>
    );
}

export default React.memo(Description);
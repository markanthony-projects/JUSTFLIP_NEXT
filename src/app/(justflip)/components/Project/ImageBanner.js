"use client";
import React, { useMemo, useCallback, useState } from "react";
import Image from "@/src/components/atoms/Image";
import MediaGallery from "./MediaGallery/MediaGallery";
import { TfiLayersAlt } from "react-icons/tfi";
import getMedia from "./MediaGallery/Media.utils";

function OverlayButton({ label, count }) {
    return (
        <>
            <div className="absolute inset-0  flex items-center justify-center bg-black/20 backdrop-blur-sm rounded overflow-hidden" />
            <div className="absolute inset-0 flex items-center justify-center">
                <button className="px-4 py-2 text-white cursor-pointer text-xs lg:text-sm flex items-center gap-1">
                    <span>{label}</span>
                    <strong className="flex items-center gap-1">
                        {count}
                        <TfiLayersAlt />
                    </strong>
                </button>
            </div>
        </>
    );
}

function ImageBanner({ project }) {
    const [modalType, setModalType] = useState("")
    const [openModal, setOpenModal] = useState(false)
    const { images, videos, floorPlans } = getMedia({ project })
    const getImage = (index) => images?.[index]?.url;

    const openModalHandler = useCallback((type) => {
        setModalType(type);
        setOpenModal(true);
    },
        [setModalType, setOpenModal]
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full relative">
            <div className="w-full h-44 md:h-[388px] lg:h-[456px] rounded overflow-hidden">
                <Image src={getImage(0)} alt={project?.name || "Project"} />
            </div>

            <button aria-label="View all images"
                className="absolute inset-0 md:hidden flex rounded overflow-hidden items-center justify-center  backdrop-blur-xs text-white text-xs"
                onClick={() => openModalHandler("images")}
            >
                Tap to see all photos
            </button>

            <div className="hidden md:grid grid-cols-2 gap-1">
                <div className="rounded overflow-hidden">
                    <Image src={getImage(1)} alt="Interior" />
                </div>


                {!videos.length && (
                    <div className="rounded overflow-hidden">
                        <Image src={getImage(2)} alt="Interior" />
                    </div>
                )}

                <div className="relative cursor-pointer rounded overflow-hidden" onClick={() => openModalHandler("images")}>
                    <Image src={getImage(3)} alt="Gallery" />
                    <OverlayButton label="Photos" count={images.length} />
                </div>

                <div className="relative cursor-pointer rounded overflow-hidden" onClick={() => openModalHandler("floorPlans")}>
                    <Image src={floorPlans?.[0]?.url} alt="Floor Plan" />
                    <OverlayButton label="Floor Plans" count={floorPlans.length} />
                </div>

                {videos?.length > 0 && (
                    <div className="relative cursor-pointer rounded overflow-hidden" onClick={() => openModalHandler("videos")} >
                        <video src={videos[0]?.url} className="w-full h-full object-cover rounded-md" muted playsInlinepreload="metadata" />
                        <OverlayButton label="Videos" count={videos?.length} />
                    </div>
                )}
            </div>

            <MediaGallery modalType={modalType} project={project} isOpen={openModal} onClose={() => setOpenModal(false)} />
        </div>
    );
}

export default React.memo(ImageBanner);
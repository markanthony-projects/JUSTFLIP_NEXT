"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import Image from "@/src/components/atoms/Image";
import Modal from "@/src/components/organisms/Modal";

export default function ImageGallery({ isOpen, onClose, images = [], }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const thumbnailsRef = useRef(null);

    useEffect(() => {
        if (isOpen) setActiveIndex(0);
    }, [isOpen]);

    const safeImages = Array.isArray(images) ? images : [];

    const handlePrevImage = useCallback(() => {
        setActiveIndex((prev) =>
            prev === 0 ? safeImages.length - 1 : prev - 1
        );
    }, [safeImages.length]);

    const handleNextImage = useCallback(() => {
        setActiveIndex((prev) =>
            prev === safeImages.length - 1 ? 0 : prev + 1
        );
    }, [safeImages.length]);

    const scrollThumbnails = (direction) => {
        if (!thumbnailsRef.current) return;

        thumbnailsRef.current.scrollBy({
            left: direction === "left" ? -300 : 300,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        if (!isOpen) return;

        const handleKey = (e) => {
            if (e.key === "ArrowRight") handleNextImage();
            if (e.key === "ArrowLeft") handlePrevImage();
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [isOpen, handleNextImage, handlePrevImage, onClose]);

    if (!safeImages.length) return null;

    const activeImage = safeImages[activeIndex];

    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth=" md:max-w-2xl lg:max-w-[880px]" className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl p-2 md:p-4 ">
            <div className="w-full flex justify-center items-center relative">
                <div className="relative h-[222px] md:h-[504px] w-full md:w-[844px] flex items-center justify-center rounded-lg overflow-hidden bg-black  ">
                    <Image
                        src={activeImage?.url}
                        alt={activeImage?.alt}
                        priority
                        sizes="(max-width: 768px) 100vw, 844px"
                        className="object-contain object-center cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
                        onClick={handleNextImage}
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 mx-0 md:mx-4 mt-3 relative">
                <button onClick={() => { scrollThumbnails("left"); handlePrevImage(); }}
                    aria-label="Previous images"
                    className="hidden md:flex cursor-pointer items-center justify-center absolute -left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full border border-gray-300 shadow-xl bg-white/90 hover:bg-white transition"
                >
                    <RiArrowLeftSLine />
                </button>

                <div
                    ref={thumbnailsRef}
                    className="     flex gap-2 overflow-x-auto scrollbar-hide w-full     scroll-smooth   "
                >
                    {safeImages.map((img, index) => {
                        if (!img?.url) return null;
                        const isActive = index === activeIndex;
                        return (
                            <button key={img.url} onClick={() => setActiveIndex(index)} aria-label={`View image ${index + 1}`} className={`relative cursor-pointer h-20 w-32 flex-shrink-0 rounded-lg overflow-hidden transition-all duration-200 ${isActive ? "border-2 border-white scale-100" : "opacity-60 scale-95 hover:opacity-100 hover:scale-100"}`}  >
                                <Image src={img.url} alt={img.alt || `thumbnail-${index}`} fill sizes="128px" loading="lazy" className="object-cover" />
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={() => { scrollThumbnails("right"); handleNextImage(); }}
                    aria-label="Next images"
                    className="hidden cursor-pointer md:flex items-center justify-center absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full border border-gray-300 shadow-xl bg-white/90 hover:bg-white transition"
                >
                    <RiArrowRightSLine />
                </button>
            </div>
        </Modal>
    );
}
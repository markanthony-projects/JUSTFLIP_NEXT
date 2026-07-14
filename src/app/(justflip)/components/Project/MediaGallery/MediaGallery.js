"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import MediaViewer from "./MediaViewer";
import ThumbnailList from "./ThumbnailList";
import Modal from "@/src/components/organisms/Modal";
import getMedia from "./Media.utils";

const TABS = [
    { key: "images", label: "Images" },
    { key: "videos", label: "Videos" },
    { key: "floorPlans", label: "Floor Plans" },
];

export default function MediaGallery({ isOpen, onClose, project, modalType = "images", }) {
    const media = useMemo(() =>
        getMedia({ project }),
        [project]);

    const [tab, setTab] = useState(modalType);
    const [activeItem, setActiveItem] = useState(null);
    const currentList = media[tab] || [];

    useEffect(() => {
        setTab(modalType)
    }, [modalType])


    useEffect(() => {
        if (!currentList.length) {
            setActiveItem(null);
            return;
        }

        setActiveItem((prev) =>
            currentList.find((m) => m.id === prev?.title) || currentList[0]
        );
    }, [tab, currentList]);

    useEffect(() => {
        if (!isOpen) return;
        const handleEsc = (e) => {
            if (e.key === "Escape") onClose?.();
        };

        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [isOpen, onClose]);

    const handleTabChange = useCallback((key) => {
        setTab(key);
    }, []);

    const handleSelect = useCallback((item) => {
        setActiveItem(item);
    }, []);

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth='max-w-[310px] sm:max-w-[420px] md:max-w-2xl lg:max-w-4xl xl:max-w-5xl' className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl p-2 md:p-4">
            <div className="w-full md:h-[500px] lg:h-[600px] flex flex-col relative">
                <div className="border-b border-gray-800 pb-3 text-center">
                    <h2 className="font-semibold text-lg">Media Gallery</h2>
                    <p className="text-xs text-gray-800">
                        Browse images, videos & floor plans
                    </p>
                </div>

                <div className="flex gap-3 ">
                    {TABS?.map((t) => {
                        const isActive = tab === t.key;
                        return (
                            <button key={t.key} onClick={() => handleTabChange(t.key)}
                                className={`relative px-4 py-2 text-sm font-medium transition-all ${isActive ? "text-[#002B5B]" : "text-gray-800 hover:text-black"}`}
                            >
                                {t.label}
                                {isActive && (
                                    <span className="absolute left-1/2 -bottom-[2px] -translate-x-1/2 w-10 h-[3px] rounded-full bg-[#002B5B]" />
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className="md:flex-1 flex items-center justify-center py-4">
                    {!activeItem ? (
                        <p className="text-gray-800">No media available</p>
                    ) : (
                        <MediaViewer item={activeItem} />
                    )}
                </div>

                <div className="w-full">
                    <ThumbnailList items={currentList} active={activeItem} onSelect={handleSelect} />
                </div>
            </div>
        </Modal>
    );
}
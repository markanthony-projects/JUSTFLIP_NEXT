"use client";

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";
import dynamic from "next/dynamic";

const SlideOver = dynamic(() => import("../layout/Header/Slider"), { ssr: false });

export interface SliderOptions {
    side?: "left" | "right";
    width?: string;
}

export interface SliderContextType {
    openSlider: (component: ReactNode, options?: SliderOptions) => void;
    closeSlider: () => void;
    isOpen: boolean;
}

const SliderContext = createContext<SliderContextType | undefined>(undefined);

export const useSlider = (): SliderContextType => {
    const context = useContext(SliderContext);
    if (!context) {
        throw new Error("useSlider must be used within a SliderProvider");
    }
    return context;
};

export function SliderProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState<ReactNode | null>(null);
    const [config, setConfig] = useState<SliderOptions>({ side: "right", width: "w-80" });

    const openSlider = useCallback((component: ReactNode, options: SliderOptions = {}) => {
        setConfig({
            side: options.side || "right",
            width: options.width || "w-80",
        });
        setContent(component);
        setIsOpen(true);
    }, []);

    const closeSlider = useCallback(() => {
        setIsOpen(false);
        setTimeout(() => {
            setIsOpen((currentOpen) => {
                if (!currentOpen) setContent(null);
                return currentOpen;
            });
        }, 300);
    }, []);

    // Memoize the context value to prevent unnecessary child re-renders
    const value = useMemo<SliderContextType>(
        () => ({ openSlider, closeSlider, isOpen }),
        [openSlider, closeSlider, isOpen]
    );

    return (
        <SliderContext.Provider value={value}>
            {children}

            {/* Only render SlideOver if it has been opened at least once to save DOM nodes */}
            {(isOpen || content) && (
                <SlideOver
                    isOpen={isOpen}
                    onClose={closeSlider}
                    side={config.side}
                    width={config.width}
                >
                    {content}
                </SlideOver>
            )}
        </SliderContext.Provider>
    );
}
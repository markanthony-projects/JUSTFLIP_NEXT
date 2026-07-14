 // "use client";

// import { createContext, useContext, useState, useCallback } from "react";
// import SlideOver from "../layout/Header/Slider";

// const SliderContext = createContext();

// export const useSlider = () => useContext(SliderContext);

// export function SliderProvider({ children }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [content, setContent] = useState(null);
//   const [config, setConfig] = useState({
//     side: "right",
//     width: "w-80",
//   });

//   const openSlider = useCallback((component, options = {}) => {
//     setConfig({
//       side: options.side || "right",
//       width: options.width || "w-80",
//     });
//     setContent(component);
//     setIsOpen(true);
//   }, []);

//   const closeSlider = useCallback(() => {
//     setIsOpen(false);
//     setTimeout(() => {
//         setIsOpen((currentOpen) => {
//             if (!currentOpen) {
//                 setContent(null);
//             }
//             return currentOpen;
//         });
//     }, 300);
//   }, []);

//   return (
//     <SliderContext.Provider value={{ openSlider, closeSlider, isOpen }}>
//       {children}

//       {/* Global Slider Instance */}
//       <SlideOver 
//         isOpen={isOpen} 
//         onClose={closeSlider} 
//         side={config.side} 
//         width={config.width}
//       >
//         {content}
//       </SlideOver>
//     </SliderContext.Provider>
//   );
// }


"use client";

import { createContext, useContext, useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";

const SlideOver = dynamic(() => import("../layout/Header/Slider"), { ssr: false });

const SliderContext = createContext();

export const useSlider = () => useContext(SliderContext);

export function SliderProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState(null);
    const [config, setConfig] = useState({ side: "right", width: "w-80" });

    const openSlider = useCallback((component, options = {}) => {
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
    const value = useMemo(
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
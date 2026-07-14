// "use client";

// import Button from "@/src/components/atoms/CloseButton";
// import { useEffect, useRef, useState } from "react";

// export default function SlideOver({
//   isOpen,
//   onClose,
//   children,
//   side = "right",
//   width = "w-80",
// }) {
//   const panelRef = useRef(null);
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => setMounted(true), []);

//   useEffect(() => {
//     document.body.style.overflow = isOpen ? "hidden" : "";
//     return () => (document.body.style.overflow = "");
//   }, [isOpen]);

//   useEffect(() => {
//     const handleEsc = (e) => e.key === "Escape" && onClose();
//     if (isOpen) window.addEventListener("keydown", handleEsc);
//     return () => window.removeEventListener("keydown", handleEsc);
//   }, [isOpen, onClose]);

//   if (!mounted) return null;

//   return (
//     <div
//       className={`fixed inset-0 z-50 min-h-screen isolate ${
//         isOpen ? "pointer-events-auto" : "pointer-events-none"
//       }`}
//       onClick={(e) => {
//         if (panelRef.current && !panelRef.current.contains(e.target)) {
//           onClose();
//         }
//       }}
//     >
//       {/* Backdrop */}
//       <div
//         className={`absolute inset-0 bg-white/10 backdrop-blur-xs transition-opacity duration-300 ${
//           isOpen ? "opacity-100" : "opacity-0"
//         }`}
//       />

//       {/* Panel */}
//       <div
//         ref={panelRef}
//         role="dialog"
//         aria-modal="true"
//         onClick={(e) => e.stopPropagation()}
//         className={`absolute top-0 h-full z-10 bg-white/10 backdrop-blur-xl
//         ${side === "left" ? "left-0 rounded-r-2xl" : "right-0 rounded-l-2xl"}
//         overflow-hidden outline-none will-change-transform
//         transform transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
//         ${width}
//         ${
//           isOpen
//             ? "translate-x-0 opacity-100"
//             : side === "left"
//             ? "-translate-x-full opacity-0"
//             : "translate-x-full opacity-0"
//         }`}
//       >
//         <div className="absolute top-0 right-0 z-20">
//           <Button onClick={onClose} />
//         </div>

//         {children}
//       </div>
//     </div>
//   );
// }

"use client";

import Button from "@/src/components/atoms/CloseButton";
import { useEffect, useState } from "react";

export default function SlideOver({
    isOpen,
    onClose,
    children,
    side = "right",
    width = "w-80 sm:w-96",
}) {
    const [mounted, setMounted] = useState(false);
    const [show, setShow] = useState(false);

    // Handle Initial Mount
    useEffect(() => setMounted(true), []);

    // Handle Animation Trigger
    useEffect(() => {
        if (isOpen) {
            // Tiny delay ensures the browser paints the starting position 
            // BEFORE applying the translate-x-0 class, triggering the animation.
            const timer = setTimeout(() => setShow(true), 10);
            return () => clearTimeout(timer);
        } else {
            setShow(false);
        }
    }, [isOpen]);

    // Handle Body Scroll
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => (document.body.style.overflow = "");
    }, [isOpen]);

    // Handle Esc Key
    useEffect(() => {
        const handleEsc = (e) => e.key === "Escape" && onClose();
        if (isOpen) window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [isOpen, onClose]);

    if (!mounted) return null;

    return (
        <div
            className={`fixed inset-0 z-50 isolate transition-opacity duration-300 ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="absolute inset-0 bg-black/21 backdrop-blur-xs transition-opacity duration-300"
                onClick={onClose}
                aria-hidden="true"
            />

            <div
                className={`overflow-hidden absolute top-0 h-full flex flex-col bg-white shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform ${width} ${side === "left"
                    ? "left-0 rounded-r-2xl border-r border-gray-100"
                    : "right-0 rounded-l-2xl border-l border-gray-100"
                    } ${show
                        ? "translate-x-0"
                        : side === "left"
                            ? "-translate-x-full"
                            : "translate-x-full"
                    }`}
            >
                <div className="absolute top-4 right-4 z-20">
                    <Button onClick={onClose} />
                </div>

                <div className="flex-1 overflow-y-auto overscroll-contain h-full w-full">
                    {children}
                </div>
            </div>
        </div>
    );
}
//this component renders a modal dialog.  It takes an isOpen prop to control its visibility, an onClose callback to handle closing the modal, and children to render inside the modal.  It also supports customizing the maximum width and additional classes for styling.  The modal prevents background scrolling when open, closes on outside clicks or pressing the Escape key, and includes a close button.
"use client";
import { useEffect, useRef } from "react";
import Button from "../atoms/CloseButton";

export default function Modal({ isOpen, onClose, children, maxWidth = "max-w-md", className = "bg-white p-6 sm:p-8 " }) {

    const modalRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    const handleOutsideClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
            onMouseDown={handleOutsideClick}
        >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            <div
                ref={modalRef}
                className={`relative z-30 w-[95%] ${maxWidth} ${className} rounded-2xl bshadow-xl  animate-modal max-h-[90vh] overflow-y-auto`}
            >
            <div className="absolute right-0 top-0 z-30">
                <Button onClick={onClose} />
            </div>
                {children}
            </div>
        </div>
    );
}
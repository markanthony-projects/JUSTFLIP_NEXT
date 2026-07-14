"use client";

import { useToastStore } from "@/src/stores/toast.store";
import {
    IoCheckmarkCircle,
    IoWarning,
    IoCloseCircle,
    IoInformationCircle,
} from "react-icons/io5";
import { useRef } from "react";

const icons = {
    success: <IoCheckmarkCircle size={22} />,
    error: <IoCloseCircle size={22} />,
    warn: <IoWarning size={22} />,
    info: <IoInformationCircle size={22} />,
};

const colors = {
    success: "text-green-400",
    error: "text-red-400",
    warn: "text-yellow-400",
    info: "text-blue-400",
};

export default function ToastContainer() {
    const { toasts, removeToast } = useToastStore();

    return (
        <div className="fixed bottom-4 right-4 z-9999 flex flex-col gap-3">
            {toasts.map((toast) => (
                <ToastCard key={toast.id} toast={toast} onClose={removeToast} />
            ))}
        </div>
    );
}

function ToastCard({ toast, onClose }) {
    const ref = useRef(null);
    let startX = 0;

    const handleStart = (e) => {
        startX = e.touches ? e.touches[0].clientX : e.clientX;
    };

    const handleMove = (e) => {
        const currentX = e.touches ? e.touches[0].clientX : e.clientX;
        const diff = currentX - startX;

        if (ref.current) {
            ref.current.style.transform = `translateX(${diff}px)`;
            ref.current.style.opacity = `${1 - Math.abs(diff) / 200}`;
        }
    };

    const handleEnd = (e) => {
        const endX = e.changedTouches
            ? e.changedTouches[0].clientX
            : e.clientX;

        const diff = endX - startX;

        if (Math.abs(diff) > 120) {
            onClose(toast.id); // swipe remove
        } else {
            // reset
            if (ref.current) {
                ref.current.style.transform = "translateX(0)";
                ref.current.style.opacity = "1";
            }
        }
    };

    return (
        <div
            ref={ref}
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
            className="
                w-[280px] md:w-[320px]
                 bg-black/20 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl
                  p-4
                flex items-center gap-3
                text-white
                transition-all duration-300
                animate-toast-in
                cursor-grab active:cursor-grabbing
            "
        >
            <div className={`flex-shrink-0 ${colors[toast.type]}`}>
                {icons[toast.type]}
            </div>

            <div className="flex-1 text-sm font-medium leading-snug">
                {toast.message}
            </div>
        </div>
    );
}
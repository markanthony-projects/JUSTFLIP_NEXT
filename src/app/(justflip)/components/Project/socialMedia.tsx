"use client";

import { useCallback, useMemo } from "react";
import { IoCall, IoLogoWhatsapp, IoMail } from "react-icons/io5";
import IconButton from "@/src/components/atoms/IconButton";

const PHONE_NUMBER = "918431362126";
const DISPLAY_NUMBER = "+91 84313 62126";

function SocialMedia({ project = "" }) {
    const projectUrl = useMemo(() => {
        if (typeof window === "undefined") return "";
        return window.location.href;
    }, []);

    const message = useMemo(() => {
        return project
            ? `Hello, I'm interested in "${project}". Link: ${projectUrl}`
            : `Hello, I'm looking for properties. Link: ${projectUrl}`;
    }, [project, projectUrl]);

    const handleWhatsAppClick = useCallback(() => {
        const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(
            message
        )}`;
        window.open(url, "_blank", "noopener,noreferrer");
    }, [message]);

    const handleCallClick = useCallback(() => {
        window.location.href = `tel:${DISPLAY_NUMBER}`;
    }, []);

    const handleMailClick = () => {
        const subject = `Enquiry for ${project || "Property"}`;
        const body = `Hello, I'm interested.\n\nLink: ${window.location.href}`;

        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=support@justflip.in&su=${encodeURIComponent(
            subject
        )}&body=${encodeURIComponent(body)}`;

        window.open(gmailUrl, "_blank");
    };

    return (
        <div className="fixed hidden md:flex right-3 top-1/2 -translate-y-1/2 flex-col gap-3 z-20">
            <IconButton
                icon={IoMail}
                onClick={handleMailClick}
                label="Email enquiry"
                bg="bg-[#2B4B7F]"
                ring="focus:ring-[#2B4B7F]"
            />

            <IconButton
                icon={IoLogoWhatsapp}
                onClick={handleWhatsAppClick}
                label="WhatsApp enquiry"
                bg="bg-[#057748]"
                ring="focus:ring-[#057748]"
            />

            <IconButton
                icon={IoCall}
                onClick={handleCallClick}
                label="Call now"
                bg="bg-[#002B5B]"
                ring="focus:ring-[#002B5B]"
            />
        </div>
    );
}

export default SocialMedia;
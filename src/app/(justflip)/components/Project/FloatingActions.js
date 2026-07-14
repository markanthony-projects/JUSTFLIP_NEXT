"use client";

import { useState, useCallback } from "react";
import { FaChevronUp, FaWhatsapp, } from "react-icons/fa";
import { IoCopyOutline } from "react-icons/io5";
import { HiOutlineArrowUpOnSquare } from "react-icons/hi2";
import { IoIosHeartEmpty, IoIosGitCompare } from "react-icons/io";
import LoginModal from "@/src/components/organisms/LoginModal";
import { toast } from "@/src/utils/toast";
import IconButton from "@/src/components/atoms/IconButton";

const ActionButton = ({ icon: Icon, onClick, label, bg = "bg-[#0B1C3D]", textColor = "text-white", hoverBg = "hover:bg-[#122a5c]", }) => (
  <button onClick={onClick} aria-label={label} className={`w-10 h-10 flex items-center justify-center    rounded-full ${bg} ${textColor}   shadow-md hover:shadow-xl ${hoverBg}   hover:scale-110 active:scale-95   transition-all duration-300`} >
    <Icon size={18} />
  </button>
);

const FloatingActions = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const isFavorite = "";

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Copy failed");
    }
  }, []);

  const handleShare = useCallback(async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: "Check Property", url });
      } catch {
        toast.error("Share cancelled");
      }
    } else {
      copyToClipboard();
    }
  }, [copyToClipboard]);

  const handleWhatsApp = useCallback(() => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://wa.me/?text=${url}`, "_blank");
  }, []);

  const handleFavorite = useCallback(() => {

  }, []);

  const handleCompare = useCallback(() => {

  }, []);


  return (
    <div className="fixed bottom-4 right-4 z-50">
      <LoginModal isOpen={showLogin} closeModal={() => setShowLogin(false)} />

      <div
        className={`flex flex-col items-center gap-3 mb-4
        transition-all duration-500
        ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`}
      >

        <button
          onClick={handleFavorite}
          className={`w-11 h-11 flex items-center justify-center rounded-full  shadow-md transition-all duration-300 hover:scale-110 active:scale-95
          ${isFavorite
              ? "bg-red-500 text-white"
              : "text-black hover:bg-gray-500 bg-white/10 backdrop-blur-xl border border-gray-300 shadow-xl"
            }`}
        >
          <IoIosHeartEmpty size={18} />
        </button>

        <IconButton
          icon={FaWhatsapp}
          onClick={handleWhatsApp}
          label="WhatsApp enquiry"
          bg="bg-green-500"
          ring="focus:ring-[#057748]"
        />


        <IconButton
          icon={HiOutlineArrowUpOnSquare}
          onClick={handleShare}
          label="Share"
          bg="bg-blue-500"
          ring="focus:ring-[#3b82f6]"
        />


        <IconButton
          icon={IoCopyOutline}
          onClick={copyToClipboard}
          label="Copy"
          bg="bg-gray-700"
          ring="focus:ring-[#3b82f6]"
        />


        <IconButton
          icon={IoIosGitCompare}
          onClick={handleCompare}
          label="Compare"
          bg="bg-purple-500"
          ring="focus:ring-[#8b5cf6]"
        />

      </div>

      <button onClick={toggleMenu} className={`w-10 h-10 flex items-center justify-center rounded-full bg-[#0B1C3D] border p-1 border-[#0B1C3D] text-white shadow-lg transition-all duration-300 ${!isOpen ? "animate-bounce" : ""}`}   >
        <FaChevronUp className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
    </div>
  );
};

export default FloatingActions;
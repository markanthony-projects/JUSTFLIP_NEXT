"use client";

import React, { useState, useTransition, useMemo } from "react";
import { isValidPhoneNumber } from "libphonenumber-js";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { FaWhatsapp } from "react-icons/fa";
import { TbMail, TbUser } from "react-icons/tb";
import { MdOutlineLocalPhone } from "react-icons/md";
import { HiBolt } from "react-icons/hi2";
import { toast } from "@/src/utils/toast";
import { JUSTFLIP } from "@/src/lib/axios/api";
import Link from "next/link";

export interface LeadFormProps {
  data: { id?: string; name?: string; [key: string]: any };
}

const isValidString = (val: any): val is string => {
  return typeof val === "string" && val.trim().length > 0;
};

function isValidRera(rera?: string | null): boolean {
  if (!rera || typeof rera !== "string") return false;
  const normalized = rera.trim().toUpperCase();
  const invalidValues = ["NO RERA", "N/A", "NA", "NOT APPLICABLE", "NONE", "NOT REQUIRED", "NO_RERA"];
  return !invalidValues.includes(normalized);
}

const getBannerContent = (data: Record<string, any> | null | undefined) => {
  if (!data || typeof data !== "object") return null;
  console.log(data.possessionStatus)

  // Extract location safely
  const locName = isValidString(data.location?.name) ? data.location.name.trim() : null;

  const seedKey = String(data.id || data.name || "default_property_seed");
  const seedIndex = seedKey.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const getRandom = (arr: string[]) => arr[seedIndex % arr.length];

  // 1. RERA Approved Check
  const isApproved = isValidString(data.approval) && data.approval.toLowerCase() === "approved";
  const hasReraNumber = isValidRera(data.rera);

  if (isApproved && hasReraNumber) {
    const reraMessages = [
      `🛡️ Great choice — 100% RERA verified property!`,
      `✨ Smart pick — RERA approved & fully verified.`,
      `🌟 Excellent choice — RERA registered property!`
    ];
    return {
      text: getRandom(reraMessages),
      containerClass: "bg-blue-50 border-blue-200 text-blue-900"
    };
  }

  const hasNegotiableUnits = Array.isArray(data.units) && data.units.some(
    (unit) => unit && typeof unit === "object" && unit.priceStatus !== "AVAILABLE"
  );

  if (hasNegotiableUnits) {
    const pricingMessages = [
      `🏷️ Great eye — Negotiable pricing available!`,
      `💎 Savvy choice — Flexible pricing options!`,
      `💰 Brilliant pick — Best value deal right here!`
    ];
    return {
      text: getRandom(pricingMessages),
      containerClass: "bg-emerald-50 border-emerald-300 text-emerald-900"
    };
  }

  const isUpcoming = isValidString(data.tags) && data.tags.toLowerCase().includes("upcoming");

  if (isUpcoming) {
    const launchMessages = [
      `⚡ Perfect timing — Early access launch!`,
      `🎯 Spot-on choice — Exclusive new launch!`,
      `🔥 Ahead of the crowd — Brand new launch!`
    ];
    return {
      text: getRandom(launchMessages),
      containerClass: "bg-[#FFFDF0] border-[#FDE047] text-[#002b5b]"
    };
  }


  const totalUnits = Number(data.totalUnits);
  const isValidUnitCount = !isNaN(totalUnits) && totalUnits > 0 && totalUnits <= 150;

  if (isValidUnitCount) {
    const inventoryMessages = [
      `🏆 Pure class — Only ${totalUnits} exclusive homes!`,
      `👑 High standards — Boutique ${totalUnits}-unit project!`,
      `💫 Great taste — Limited to just ${totalUnits} residences!`
    ];
    return {
      text: getRandom(inventoryMessages),
      containerClass: "bg-amber-50 border-amber-300 text-amber-900"
    };
  }

  const isReadyToMove = isValidString(data.possessionStatus) && 
    data.possessionStatus.toLowerCase().trim() === "ready to move in";

  if (isReadyToMove) {
    const possessionMessages = [
      `🔑 Top-tier choice — Ready to move in!`,
      `🏡 Flawless pick — Immediate handover available!`,
      `🎉 Great selection — Turn key home ready now!`
    ];
    return {
      text: getRandom(possessionMessages),
      containerClass: "bg-emerald-50 border-emerald-300 text-emerald-900"
    };
  }

  const locationText = locName ? ` in ${locName}` : "";
  const locationMessages = [
    `🌟 Great taste — Remarkable choice!`,
    `👌 Outstanding choice${locationText}!`,
    `🎯 Spot on — A standout property!`
  ];

  return {
    text: getRandom(locationMessages),
    containerClass: "bg-slate-50 border-slate-200 text-slate-800"
  };
};

const LeadForm = ({ data }: LeadFormProps) => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const banner = useMemo(() => getBannerContent(data), [data]);

  const handleChange = (key: string, value: string | undefined) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Name is required";
    if (!formData.email.includes("@")) return "Invalid email";
    if (!formData.phone || !isValidPhoneNumber(formData.phone))
      return "Invalid phone number";
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      setErrorMsg(error);
      toast.error(error);
      return;
    }

    setErrorMsg(null);

    startTransition(async () => {
      try {
        const res = await JUSTFLIP.post("/lead", { ...formData, projectId: data?.id });
        setFormData({ name: "", email: "", phone: "" });
        toast.success(res.data?.message || "Submitted successfully");
      } catch (err: any) {
        console.error("Submit Error:", err);
        toast.error(err.message);
      }
    });
  };

  const handleWhatsApp = () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    const phone = "918431362126";

    const message = `Hello, I'm interested in "${data?.name}". ${url}`;

    window.open(
      `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const handleCall = () => {
    if (typeof window === "undefined") return;
    window.location.href = `tel:918431362126`;
  };

  return (
    <div
      className="bg-white rounded-xl p-4 md:p-6 lg:p-6"
      style={{ boxShadow: "0px 0px 10px 1px #dad6d6" }}
    >
      {/* Dynamic Toast / Banner */}
      {banner && (
        <div
          className={`w-max max-w-full mx-auto flex items-center px-3 gap-2 py-2 border rounded-lg text-[9px] md:text-xs font-medium shadow-sm transition-all duration-300 ${banner.containerClass}`}
        >
          <span className="truncate">{banner.text}</span>
        </div>
      )}

      <div className="text-center space-y-1 mt-4">
        <h1 className="text-[#2B4B7F] font-semibold text-sm md:text-lg">
          Get an Instant Callback!
        </h1>
        <p className="text-gray-400 text-xs md:text-sm">
          Interested in {data?.name}?
        </p>
      </div>

      <form className="mt-3 space-y-3" onSubmit={handleSubmit}>
        <div className="relative rounded focus-within:ring focus-within:ring-[#002B5B]">
          <TbUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Name"
            className="w-full p-3 pl-10 border border-gray-300 rounded text-sm outline-none"
          />
        </div>

        <div className="relative rounded focus-within:ring focus-within:ring-[#002B5B]">
          <TbMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Email"
            className="w-full p-3 pl-10 border border-gray-300 rounded text-sm outline-none"
          />
        </div>

        <PhoneInput
          value={formData.phone}
          onChange={(val) => handleChange("phone", val)}
          defaultCountry="IN"
          placeholder="Enter Phone Number"
          className="w-full flex items-center border border-gray-300 rounded px-3 py-3 focus-within:ring focus-within:ring-[#002B5B] text-sm"
          numberInputProps={{ className: "outline-none w-full bg-transparent" }}
        />

        <p className="text-[8px] font-medium text-[#333333] text-center">
          By Submitting you agree to all{" "}
          <Link href="" className="text-[#002B5B] text-[9px] font-bold">
            Terms & Conditions
          </Link>{" "}
          of JustFlip
        </p>

        <button
          type="submit"
          disabled={isPending}
          aria-busy={isPending}
          aria-disabled={isPending}
          className={`w-full h-10 flex items-center cursor-pointer justify-center gap-2 rounded-lg text-sm font-medium text-white transition-all duration-200 ease-in-out transform hover:scale-[1.03] active:scale-95 bg-[#002B5B] ${
            isPending && "opacity-50 cursor-not-allowed"
          }`}
        >
          {isPending && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {isPending ? "Submitting..." : "Submit"}
        </button>
      </form>

      <div className="flex items-center my-3">
        <div className="flex-1 border-t" />
        <span className="px-2 text-xs">OR</span>
        <div className="flex-1 border-t" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleCall}
          className="flex items-center cursor-pointer justify-center gap-2 bg-[#002B5B] text-white p-2 rounded-lg text-sm transition-all duration-200 ease-in-out transform hover:scale-[1.03] active:scale-95"
        >
          Call <MdOutlineLocalPhone />
        </button>

        <button
          onClick={handleWhatsApp}
          className="flex cursor-pointer items-center justify-center gap-2 bg-green-600 text-white p-2 rounded-lg text-sm transition-all duration-200 ease-in-out transform hover:scale-[1.03] active:scale-95"
        >
          WhatsApp <FaWhatsapp />
        </button>
      </div>
    </div>
  );
};

export default LeadForm;
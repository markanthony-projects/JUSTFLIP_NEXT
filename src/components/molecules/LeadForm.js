"use client";

import React, { useState, useTransition } from "react";
import { isValidPhoneNumber } from "libphonenumber-js";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { FaWhatsapp } from "react-icons/fa";
import { TbMail, TbUser } from "react-icons/tb";
import { MdOutlineLocalPhone } from "react-icons/md";
import { toast } from "@/src/utils/toast";
import { JUSTFLIP } from "@/src/lib/axios/api";
import Link from "next/link";

const LeadForm = ({ data }) => {
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", });
    const [isPending, startTransition] = useTransition();
    const [errorMsg, setErrorMsg] = useState(null);

    const handleChange = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const validateForm = () => {
        if (!formData.name.trim()) return "Name is required";
        if (!formData.email.includes("@")) return "Invalid email";
        if (!formData.phone || !isValidPhoneNumber(formData.phone))
            return "Invalid phone number";
        return null;
    };

    const handleSubmit = (e) => {
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
                const res = await JUSTFLIP.post("/api/lead", { ...formData, projectId: data?.id });
                setFormData({ name: "", email: "", phone: "" });
                toast.success(res.data?.message || "Submitted successfully");
            } catch (err) {
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

        window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`, "_blank");
    };

    const handleCall = () => {
        if (typeof window === "undefined") return;
        window.location.href = `tel:918431362126`;
    };

    return (
        <div className="bg-white rounded-xl p-4 md:p-6 lg:p-8 " style={{ boxShadow: "0px 0px 10px 1px #dad6d6" }}>
            <div className="text-center space-y-1">
                <h1 className="text-[#2B4B7F] font-semibold text-sm md:text-lg"> Get an Instant Callback!</h1>
                <p className="text-gray-400 text-xs md:text-sm"> Interested in {data?.name}?</p>
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
                    <input type="email" value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)} placeholder="Email"
                        className="w-full p-3 pl-10 border border-gray-300 rounded text-sm outline-none" />
                </div>

                <PhoneInput
                    value={formData.phone}
                    onChange={(val) => handleChange("phone", val)}
                    defaultCountry="IN"
                    placeholder="Enter Phone Number"
                    className="w-full flex items-center border border-gray-300 rounded px-3 py-3 focus-within:ring focus-within:ring-[#002B5B] text-sm"
                    numberInputProps={{ className: "outline-none w-full bg-transparent" }}
                />

                <p className="text-[8px] font-medium text-[#333333] text-center">By Submitting you agree to all <Link href='' className="text-[#002B5B]  text-[9px] font-bold  ">Terms & Conditions</Link>  of JustFlip</p>

                <button
                    type="submit"
                    disabled={isPending}
                    aria-busy={isPending}
                    aria-disabled={isPending}
                    className={`w-full h-10 flex items-center cursor-pointer justify-center gap-2 rounded-lg text-sm font-medium text-white transition-all duration-200 ease-in-out  transform hover:scale-[1.03] active:scale-95 bg-[#002B5B]  ${isPending && "opacity-50 cursor-not-allowed"} `}
                >
                    {isPending && (<span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />)}

                    {isPending ? "Submitting..." : "Submit"}
                </button>
            </form>

            <div className="flex items-center my-3">
                <div className="flex-1 border-t" />
                <span className="px-2 text-xs">OR</span>
                <div className="flex-1 border-t" />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button onClick={handleCall} className="flex items-center cursor-pointer justify-center gap-2 bg-[#002B5B] text-white p-2 rounded-lg text-sm transition-all duration-200 ease-in-out  transform hover:scale-[1.03] active:scale-95">
                    Call <MdOutlineLocalPhone />
                </button>

                <button onClick={handleWhatsApp} className="flex cursor-pointer items-center justify-center gap-2 bg-green-600 text-white p-2 rounded-lg text-sm transition-all duration-200 ease-in-out  transform hover:scale-[1.03] active:scale-95">
                    WhatsApp <FaWhatsapp />
                </button>
            </div>
        </div>
    );
};

export default LeadForm;
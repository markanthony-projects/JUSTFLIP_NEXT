"use client";

import React, { useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheckCircle } from "react-icons/fi";
import { HiOutlineHome, HiOutlineTag, HiOutlineKey, HiOutlineRefresh, HiOutlineQuestionMarkCircle } from "react-icons/hi";
import { JUSTFLIP } from "@/src/lib/axios/api";

const Contact = () => {
  interface ContactFormData {
    transaction: string;
    name: string;
    email: string;
    phone: string;
    message: string;
  }

  const [formData, setFormData] = useState<ContactFormData>({
    transaction: "general",
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [apiError, setApiError] = useState("");

  const assistanceOptions = [
    { label: "Buy", value: "buy", icon: HiOutlineHome },
    { label: "Sell", value: "sell", icon: HiOutlineTag },
    { label: "Re-Sale", value: "resale", icon: HiOutlineRefresh },
    { label: "General Query", value: "general", icon: HiOutlineQuestionMarkCircle },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
    setApiError("");
  };

  const handleTransactionSelect = (value: string) => {
    setFormData({ ...formData, transaction: value });
    setErrors({ ...errors, transaction: "" });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.transaction) newErrors.transaction = "Transaction type is required.";
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid.";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number should be 10 digits.";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError("");

    try {
      const response = await JUSTFLIP.post("/lead", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 || response.status === 201) {
        setIsSubmitted(true);
        setFormData({ transaction: "buy", name: "", email: "", phone: "", message: "" });
        setErrors({});
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again later.";
      setApiError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto my-2 sm:my-6 sm:px-6 lg:px-8 font-sans antialiased">
      {/* Container - borderless and padding-free on mobile, card style on desktop */}
      <div className="bg-transparent sm:bg-white text-slate-800 sm:rounded-3xl sm:shadow-lg sm:border sm:border-slate-100 overflow-hidden">
        
        {/* Header Section */}
        <section className="px-0 sm:px-10 md:px-12 pt-2 sm:pt-10 pb-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#002B5B]">
              Contact Us
            </h1>
            <p className="mt-2 sm:mt-3 text-sm sm:text-lg text-[#64748B] font-medium leading-relaxed">
              Whether you&apos;re looking to buy, sell, or rent, our property specialists are here to assist you every step of the way.
            </p>
          </div>
        </section>

        {/* Main Content Grid */}
        <section className="p-0 sm:p-10 md:p-12 pb-6 flex flex-col-reverse lg:grid lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          
          {/* Left Side Info Card */}
          <div className="lg:col-span-5 bg-slate-50/80 border border-slate-200/60 p-5 sm:p-8 rounded-2xl flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#002B5B] mb-2">
                  How can we help you?
                </h2>
              </div>

              <div className="space-y-5 sm:space-y-6 pt-2 sm:pt-5">
                <div className="flex items-center space-x-4">
                  <div className="p-3.5 bg-white text-[#002B5B] rounded-2xl border border-slate-200 shrink-0 flex items-center justify-center shadow-xs">
                    <FiMail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold tracking-wider text-[#8C9BAB] uppercase">
                      Direct Email
                    </p>
                    <a
                      href="mailto:Justflipcontact@gmail.co.in"
                      className="text-sm sm:text-base font-bold text-[#002B5B] hover:text-[#002B5B] transition-colors break-all block mt-0.5"
                    >
                      Justflipcontact@gmail.co.in
                    </a>
                  </div>
                </div>

                {/* Phone Support */}
                <div className="flex items-center space-x-4">
                  <div className="p-3.5 bg-white text-[#002B5B] rounded-2xl border border-slate-200 shrink-0 flex items-center justify-center shadow-xs">
                    <FiPhone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold tracking-wider text-[#8C9BAB] uppercase">
                      Phone Support
                    </p>
                    <p className="text-sm sm:text-base font-bold text-[#002B5B] mt-0.5">
                      +91 (800) 123-4567
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="p-3.5 bg-white text-[#002B5B] rounded-2xl border border-slate-200 shrink-0 flex items-center justify-center shadow-xs">
                    <FiMapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold tracking-wider text-[#8C9BAB] uppercase">
                      Office Address
                    </p>
                    <p className="text-sm sm:text-base font-bold text-[#002B5B] mt-0.5">
                      Oxford House, Murugeshpalya
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200/80">
              <p className="text-xs text-[#002B5B] font-semibold leading-relaxed flex items-center justify-center space-x-1">
                <span>&#x1F6E1;</span>
                <span>100% Secure & Private Listing</span>
              </p>
            </div>
          </div>

          {/* Right Side Form Container */}
          <div className="lg:col-span-7 bg-transparent sm:bg-white border-0 sm:border sm:border-slate-200/60 p-0 sm:p-8 rounded-2xl sm:shadow-xs flex flex-col justify-between">
            {isSubmitted ? (
              <div className="text-center py-12 space-y-4 my-auto">
                <FiCheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
                <h3 className="text-2xl font-extrabold text-[#002B5B]">Message Sent!</h3>
                <p className="text-[#64748B] max-w-md mx-auto text-sm font-medium leading-relaxed">
                  Thank you for reaching out. We have received your query and will get back to you shortly.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 px-6 py-3 bg-[#002B5B] hover:bg-[#002046] text-white text-sm rounded-xl font-bold transition cursor-pointer shadow-md shadow-[#002B5C]/20"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 my-auto" noValidate>
                {apiError && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
                    {apiError}
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C9BAB] mb-2.5">
                    Transaction Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {assistanceOptions.map((option) => {
                      const isSelected = formData.transaction === option.value;
                      const Icon = option.icon;
                      return (
                        <button
                          type="button"
                          key={option.value}
                          onClick={() => handleTransactionSelect(option.value)}
                          className={`w-full py-2.5 px-2 rounded-xl text-xs sm:text-xs font-bold border transition-all duration-200 flex items-center justify-center space-x-1.5 cursor-pointer min-w-0 ${
                            isSelected
                              ? "bg-[#002B5B] text-white border-[#002B5B] shadow-md shadow-[#002B5B]/20"
                              : "bg-white text-[#8C9BAB] border-slate-200 hover:bg-slate-50 hover:text-[#092242]"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 shrink-0" />
                          <span className="whitespace-nowrap">{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  {errors.transaction && (
                    <p className="text-red-500 text-xs font-medium mt-1.5">{errors.transaction}</p>
                  )}
                </div>

                {/* Name, Email, Phone Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C9BAB] mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className={`w-full bg-slate-50/50 border ${
                        errors.name ? "border-red-500" : "border-slate-200"
                      } focus:bg-white focus:border-[#002B5C] focus:ring-2 focus:ring-[#002B5C]/10 rounded-xl px-4 py-3 text-sm font-semibold text-[#092242] placeholder-[#8C9BAB] outline-none transition`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs font-medium mt-1.5">{errors.name}</p>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C9BAB] mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className={`w-full bg-slate-50/50 border ${
                        errors.email ? "border-red-500" : "border-slate-200"
                      } focus:bg-white focus:border-[#002B5C] focus:ring-2 focus:ring-[#002B5C]/10 rounded-xl px-4 py-3 text-sm font-semibold text-[#092242] placeholder-[#8C9BAB] outline-none transition`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs font-medium mt-1.5">{errors.email}</p>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C9BAB] mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit number"
                      className={`w-full bg-slate-50/50 border ${
                        errors.phone ? "border-red-500" : "border-slate-200"
                      } focus:bg-white focus:border-[#002B5C] focus:ring-2 focus:ring-[#002B5C]/10 rounded-xl px-4 py-3 text-sm font-semibold text-[#092242] placeholder-[#8C9BAB] outline-none transition`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs font-medium mt-1.5">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Message Textarea */}
                <div className="flex flex-col">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C9BAB] mb-2">
                    Message to us
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Enter your message here..."
                    className={`w-full bg-slate-50/50 border ${
                      errors.message ? "border-red-500" : "border-slate-200"
                    } focus:bg-white focus:border-[#002B5B] focus:ring-2 focus:ring-[#002B5B]/10 rounded-xl p-4 text-sm font-semibold text-[#092242] placeholder-[#8C9BAB] outline-none transition resize-none`}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs font-medium mt-1.5">{errors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-[#002B5B] hover:bg-[#002046] active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-md shadow-[#002B5C]/20 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{isSubmitting ? "Submitting..." : "Submit Inquiry"}</span>
                    <FiSend className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;



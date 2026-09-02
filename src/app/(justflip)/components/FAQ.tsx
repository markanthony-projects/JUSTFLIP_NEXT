"use client";

import { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";
import { buildFAQSchema } from "@/src/utils/schema";
import Link from "next/link";

interface FAQProps {
    data: any;
    title?: string;
    showContactLink?: boolean;
}

export default function FAQ({ data, title = "Frequently Asked Questions", showContactLink = true }: FAQProps) {
    const faqs = data?.faqs || data;
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggle = (index: number) => {
        setOpenIndex((prev) => (prev === index ? null : index));
    };

    if (!faqs || !Array.isArray(faqs) || !faqs.length) return null;

    const faqSchema = buildFAQSchema(faqs);

    const formatQuestion = (question: string) => {
        if (!question) return "";
        const trimmed = question.trim();
        if (/^q\s*:/i.test(trimmed)) return trimmed;
        return `Q: ${trimmed}`;
    };

    return (
        <div className="py-6 md:py-10 my-2 md:my-4">
            {faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}
            <div className="w-full max-w-4xl mx-auto px-1 sm:px-2">
                <div className="text-center mb-6 md:mb-8 px-2">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                        {title}
                    </h2>
                    {showContactLink && (
                        <p className="mt-2 text-xs md:text-sm text-gray-500 max-w-2xl mx-auto">
                            Can't find the answer you're looking for? Feel free to{" "}
                            <Link href="/contact-us" className="text-[#002B5B] underline font-semibold transition-colors">
                                Contact Us
                            </Link>.
                        </p>
                    )}
                </div>

                <div className="bg-white rounded-xl md:rounded-2xl border border-gray-200/90 shadow-sm divide-y divide-gray-100 overflow-hidden">
                    {faqs.map((faq: any, index: number) => {
                        const isOpen = openIndex === index;
                        const question = formatQuestion(faq?.question);

                        return (
                            <div
                                key={faq?.id || index}
                                className={`transition-colors duration-150 ${isOpen ? "bg-gray-50/40" : "hover:bg-gray-50/30"}`}
                            >
                                <button
                                    type="button"
                                    onClick={() => toggle(index)}
                                    aria-expanded={isOpen}
                                    aria-controls={`faq-answer-${index}`}
                                    className="w-full flex items-start justify-between gap-4 py-3.5 px-4 md:py-4 md:px-6 text-left cursor-pointer focus:outline-none select-none"
                                >
                                    <span className="text-sm md:text-[15px] font-bold text-gray-900 leading-snug tracking-tight">
                                        {question}
                                    </span>

                                    <span className="flex-shrink-0 mt-0.5 text-gray-600 transition-transform duration-200">
                                        {isOpen ? (
                                            <FiMinus className="w-4 h-4 md:w-[18px] md:h-[18px] text-gray-800 stroke-[2.5]" />
                                        ) : (
                                            <FiPlus className="w-4 h-4 md:w-[18px] md:h-[18px] text-gray-500 hover:text-gray-800 stroke-[2]" />
                                        )}
                                    </span>
                                </button>

                                <div
                                    id={`faq-answer-${index}`}
                                    className={`grid transition-all duration-200 ease-in-out ${
                                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                    }`}
                                >
                                    <div className="overflow-hidden">
                                        <div className="px-4 pb-4 md:px-6 md:pb-4.5 pt-0">
                                            <p className="text-xs md:text-[14.5px] text-gray-600 leading-relaxed font-normal">
                                                {faq?.answer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { buildFAQSchema } from "@/src/utils/schema";
import Link from "next/link";

export default function FAQ({ data }: { data: any }) {
    const faqs = data?.faqs || data;
    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (index: number) => { setOpenIndex((prev) => (prev === index ? null : index as any)); };

    if (!faqs || !faqs.length) return null;

    const faqSchema = buildFAQSchema(faqs);

    return (
        <div className="py-8 md:py-16 my-4 md:my-8 rounded-3xl">
            {faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}
            <div className="px-4 mx-auto w-full max-w-4xl">
                <div className="text-center mb-8 md:mb-12 px-2">
                    <h2 className="text-2xl md:text-4xl font-bold text-gray-900 tracking-tight">
                        Frequently Asked Questions
                    </h2>
                    <p className="mt-3 md:mt-4 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
                        Can't find the answer you're looking for? Feel free to <Link href="/contact-us" className="text-[#002B5B]  underline font-semibold transition-colors">Contact Us</Link>.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq: any, index: number) => {
                        const isOpen = openIndex === index;

                        return (
                            <div 
                                key={index} 
                                className={`group bg-white rounded-2xl border transition-all duration-300 ${isOpen ? 'border-[#002B5B] shadow-md' : 'border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'}`}
                            >
                                <button 
                                    onClick={() => toggle(index)} 
                                    aria-expanded={isOpen} 
                                    aria-controls={`faq-${index}`} 
                                    className="w-full flex items-center justify-between gap-3 md:gap-4 p-4 md:p-6 text-left transition-colors focus:outline-none"  
                                >
                                    <span className={`text-[15px] md:text-lg font-semibold transition-colors duration-300 ${isOpen ? 'text-[#002B5B]' : 'text-gray-800 group-hover:text-[#002B5B]'}`}>
                                        {faq?.question}
                                    </span>
                                    
                                    <div className={`flex-shrink-0 w-7 h-7 md:w-10 md:h-10 flex items-center justify-center rounded-full transition-all duration-300 ${isOpen ? 'bg-[#002B5B]/10 text-[#002B5B]' : 'bg-gray-100 text-gray-500 group-hover:bg-[#002B5B]/5 group-hover:text-[#002B5B]'}`}>
                                        <FiChevronDown 
                                            className={`transition-transform duration-300 w-4 h-4 md:w-5 md:h-5 ${isOpen ? "rotate-180" : ""}`} 
                                        />
                                    </div>
                                </button>

                                <div 
                                    id={`faq-${index}`} 
                                    className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}     
                                >
                                    <div className="overflow-hidden">
                                        <p className="px-4 md:px-6 pb-4 md:pb-6 text-gray-600 leading-relaxed text-sm md:text-base">
                                            {faq?.answer}
                                        </p>
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
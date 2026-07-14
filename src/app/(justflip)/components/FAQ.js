"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { buildFAQSchema } from "@/src/utils/schema";

export default function FAQ({ data }) {
    const faqs = data?.faqs || data;
    const [openIndex, setOpenIndex] = useState(null)

    const toggle = (index) => { setOpenIndex((prev) => (prev === index ? null : index)); };

    if (!faqs.length) return null;

    const faqSchema = buildFAQSchema(faqs);

    return (
        <div className="bg-[#F3F8FA] rounded-xl my-4 ">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <div className="p-4 mx-auto w-full sm:w-4/5 md:w-4/5 lg:w-3/4 xl:w-3/4">
                <section className="py-8">
                    <h2 className=" text-md md:text-lg font-semibold  text-center pb-4">
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-[8px] ">
                        {faqs.map((faq, index) => {
                            const isOpen = openIndex === index;

                            return (
                                <div key={index} className="group border-b border-gray-500">
                                    <button onClick={() => toggle(index)} aria-expanded={isOpen} aria-controls={`faq-${index}`} className="w-full flex items-center justify-between gap-4 py-4 text-left transition "  >

                                        <span className="text-sm  font-medium text-[#002B5B]">
                                            {faq?.question}
                                        </span>

                                        <FiChevronDown className={`text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} size={20} />
                                    </button>

                                    <div id={`faq-${index}`} className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}     >
                                        <div className="overflow-hidden">
                                            <p className="p-4 pt-0 text-sm text-gray-600 leading-relaxed">
                                                {faq?.answer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>
        </div>

    );
}
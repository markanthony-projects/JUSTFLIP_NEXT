"use client";

import React, { useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";

export interface AccordionPlace {
    name: string;
    vicinity?: string;
    [key: string]: any;
}

export interface AccordionItem {
    title: string;
    Icon?: React.ElementType;
    data?: AccordionPlace[];
    emptyText?: string;
    [key: string]: any;
}

export interface AccordionProps {
    items?: AccordionItem[];
    defaultOpenIndex?: number;
}

export default function Accordion({ items = [], defaultOpenIndex = 0 }: AccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);
    const toggle = (index: number) => { setOpenIndex((prev) => (prev === index ? null : index)); };

    return (
        <div className="">
            {items.map((item, index) => {
                const isOpen = openIndex === index;
                const Icon = item.Icon;

                return (
                    <div key={index} className="py-2 border-b border-gray-100">
                        <div 
                            onClick={() => toggle(index)} 
                            className="grid grid-cols-[auto_1fr_auto] items-center cursor-pointer text-sm font-bold text-gray-1000 hover:text-[#002B5B] transition-colors"
                        >
                            {Icon && <Icon className="mr-2 text-base text-[#002B5B]" />}
                            <span>{item.title}</span>
                            {isOpen ? (<BsChevronUp className="ml-2 text-xs" />) : (<BsChevronDown className="ml-2 text-xs" />)}
                        </div>

                        <div className={`transition-all duration-300 overflow-hidden ${isOpen ? "max-h-96 mt-2" : "max-h-0"}`}>
                            {(item.data?.length ?? 0) > 0 ? (
                                <ul className="space-y-1.5 pl-1">
                                    {item.data?.map((place, i) => (
                                        <li key={i} className="text-xs text-gray-600 leading-normal">
                                            <span className="font-medium">{place.name}</span>
                                            {place.vicinity && (
                                                <span className="text-gray-600"> - {place.vicinity}</span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-xs text-gray-400 italic pl-1">{item.emptyText}</p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
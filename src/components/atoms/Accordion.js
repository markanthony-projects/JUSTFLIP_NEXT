"use client";

import { useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";

export default function Accordion({ items = [] }) {
    const [openIndex, setOpenIndex] = useState(null);
    const toggle = (index) => { setOpenIndex((prev) => (prev === index ? null : index)); };
    return (
        <div className="">
            {items.map((item, index) => {
                const isOpen = openIndex === index;
                const Icon = item.Icon;

                return (
                    <div key={index} className="py-2 border-b-2 border-gray-300">
                        <div onClick={() => toggle(index)} className="grid grid-cols-[auto_1fr_auto] items-center cursor-pointer text-sm" >
                            {Icon && <Icon className="mx-2" />}
                            <span>{item.title}</span>
                            {isOpen ? (<BsChevronUp className="ml-2" />) : (<BsChevronDown className="ml-2" />)}
                        </div>
                        <div className={`transition-all duration-300 overflow-hidden ${isOpen ? "max-h-96 mt-2" : "max-h-0"}`}>
                            {item.data?.length > 0 ? (
                                <ul>
                                    {item.data.map((place, i) => (
                                        <li key={i} className="my-2 text-xs">
                                            {place.name} - {place.vicinity}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-xs">{item.emptyText} </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
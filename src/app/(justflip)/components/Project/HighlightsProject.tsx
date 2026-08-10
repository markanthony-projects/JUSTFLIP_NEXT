"use client";

import { memo, useState } from "react";

import HighlightItem from "./HighlightItem";

import { Project } from "@/src/types";

function HighlightsProject({ project }: { project: Project }) {
  const { name, advantages = [] } = project || {};

  const [openIndex, setOpenIndex] = useState(0);

  if (!advantages.length) return null;

  const handleToggle = (index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? -1 : index));
  };

  return (
    <section className="pt-4 md:pt-0">
      <h2 className="text-sm md:text-lg font-semibold pb-4">
        Highlights of {name}
      </h2>

      <div className="border border-gray-300 rounded-xl overflow-hidden bg-white">
        <div className="bg-[#002B5B] text-white px-5 py-4">
          <p className="text-sm md:text-lg font-medium">
            Why Choose {name}?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 py-4 md:py-6 px-4">
          {advantages.map((advantage: any, index: number) => (
            <HighlightItem
              key={advantage?.title || index}
              title={advantage?.title}
              description={advantage?.description}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(HighlightsProject);
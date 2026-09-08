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
    <section>
      <h2 className="section-heading">
        Highlights of {name}
      </h2>

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
      
    </section>
  );
}

export default memo(HighlightsProject);
"use client";

import ProjectCard from "@/src/components/Cards/ProjectCard";
import Carousel from "@/src/components/Carousel";

export default function ProjectCarousel({ projects }) {
    return (
        <Carousel
            items={projects}
            gap={16}
            aspect="h-fit"
            showDots={false}
            showArrows
            renderItem={(project, i) => (
                <ProjectCard
                    key={project?.id}
                    project={project}
                    priority={i < 2}
                />
            )}
        />
    );
}
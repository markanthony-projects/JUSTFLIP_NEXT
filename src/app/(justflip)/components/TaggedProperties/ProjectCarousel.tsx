"use client";

import ProjectCard from "@/src/components/Cards/ProjectCard";
import Carousel from "@/src/components/Carousel";
import { Project } from "@/src/types";

export default function ProjectCarousel({ projects }: { projects: Project[] }) {
    return (
        <Carousel
            items={projects}
            gap={16}
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
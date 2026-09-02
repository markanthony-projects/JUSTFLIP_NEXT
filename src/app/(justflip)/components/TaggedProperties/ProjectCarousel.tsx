"use client";

import FeaturedProperty from "@/src/components/Cards/FeaturedProperty";
import ProjectCard from "@/src/components/Cards/ProjectCard";
import Carousel from "@/src/components/Carousel";
import { Project } from "@/src/types";

interface ProjectCarouselProps{
    projects: Project[];
    varient?: "featured" | "default";
}

export default function ProjectCarousel({ projects, varient = "default" }: ProjectCarouselProps) {
    return (
        <Carousel
            items={projects}
            gap={16}
            showDots={false}
            showArrows
            renderItem={(project, i) => 
                varient === 'featured' ? (
                    <FeaturedProperty
                    key={project?.id}
                    project={project}
                    priority={i < 2}/>
                ):(<ProjectCard
                    key={project?.id}
                    project={project}
                    priority={i < 2}
                />)
            }
        />
    );
}
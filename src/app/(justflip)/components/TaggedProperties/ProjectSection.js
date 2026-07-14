"use client";

import ProjectCard from "@/src/components/Cards/ProjectCard";
import Carousel from "@/src/components/Carousel";
import LazyHydrate from "@/src/components/LazyHydrate";
import { PropertyCardSkeletonList } from "../Skelton/PropertyCardSkeleton";


export default function ProjectSection({ projects }) {
    return (
        <LazyHydrate placeholder={<PropertyCardSkeletonList />}>
            <Carousel
                items={projects}
                itemWidth={300}
                gap={16}
                aspect="h-fit"
                showDots={false}
                showArrows
                renderItem={(project, i) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        priority={i < 2}
                    />
                )}
            />
        </LazyHydrate>
    );
}
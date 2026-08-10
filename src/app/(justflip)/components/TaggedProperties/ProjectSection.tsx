"use client";

import ProjectCard from "@/src/components/Cards/ProjectCard";
import Carousel from "@/src/components/Carousel";
import LazyHydrate from "@/src/components/LazyHydrate";
import { PropertyCardSkeletonList } from "../Skelton/PropertyCardSkeleton";
import PropertyCard from "@/src/components/Cards/PropertyCard";
import TopPropertyCard from "../TopPropertyCard";

import { Project } from "@/src/types";

export default function ProjectSection({ projects }: { projects: Project[] }) {
    return (
        <LazyHydrate placeholder={<PropertyCardSkeletonList />}>
            <Carousel
                items={projects}
                gap={16}
                showDots={false}
                showArrows
                renderItem={(project, i) => (
                    <TopPropertyCard
                        key={project.id}
                        project={project}
                        priority={i < 2}
                    />
                )}
            />
        </LazyHydrate>
    );
}
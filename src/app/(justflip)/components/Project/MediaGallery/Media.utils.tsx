import { Project, Media } from "@/src/types";

export default function getMedia({ project }: { project: Project }) {
    const medias = project?.medias || [];
    const normalize = (str?: string) => (str || "").toLowerCase();

    const images = medias.filter((m: Media) => m.type === "image" && normalize(m.title) === "other");
    const videos = medias.filter((m: Media) => m.type === "video" && normalize(m.title) === "video");
    const floorPlans = project?.units?.flatMap((u: any) => u?.floorPlans || []) || [];
    return { images, videos, floorPlans };
}
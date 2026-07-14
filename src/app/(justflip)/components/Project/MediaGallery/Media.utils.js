export default function getMedia({ project }) {
    const medias = project?.medias || [];
    const normalize = (str) => (str || "").toLowerCase();

    const images = medias.filter((m) => m.type === "image" && normalize(m.title) === "other");
    const videos = medias.filter((m) => m.type === "video" && normalize(m.title) === "video");
    const floorPlans = project?.units.flatMap((u) => u?.floorPlans || []);
    return { images, videos, floorPlans };
}
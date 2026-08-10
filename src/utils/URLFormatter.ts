export const formatUrl = (text: string | null | undefined): string => {
    if (!text || typeof text !== "string") return "unknown";
    return text.toLowerCase().trim().replace(/\s+/g, "-");
};
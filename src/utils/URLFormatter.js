export const formatUrl = (text) => {
    if (!text || typeof text !== "string") return "unknown";
    return text.toLowerCase().trim().replace(/\s+/g, "-");
};
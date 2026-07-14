"use server";

import JustflipService from "@/src/services/JustflipService";


export async function fetchSuggestionsAction(query) {
    if (!query || query.trim().length < 2) {
        return {
            projects: [],
            builders: [],
            locations: [],
        };
    }

    const result = await JustflipService.suggestions(query);

    return {
        projects: result.projects || [],
        builders: result.builders || [],
        locations: result.locations || [],
    };
}

// "use server";

// import { JUSTFLIP } from "../lib/axios/api";
// import { handleApiError } from "../lib/axios/apiError";
// import { getQueryParam } from "../utils/getQueryParam";

// class ProjectService {
//     static async fetchProjectsByTag({ tag, cityId, page = 1, limit = 25 }) {
//         try {
//             const { data } = await JUSTFLIP.get(`/project/tagged`, {
//                 params: { tag, cityId, page, limit },
//             });
//             return data?.projects || [];
//         } catch (error) {
//             handleApiError(error);
//         }
//     }

//     static async fetchExploreProjects({ typeId, type, page = 1, limit = 25, }) {
//         try {
//             const queryParam = getQueryParam(type, typeId)
//             const { data } = await JUSTFLIP.get(`/project/explore-projects`, { params: { typeId, type, page, limit, ...queryParam } });
//             return data?.projects || [];
//         } catch (error) {
//             handleApiError(error);
//         }
//     }

//     static async fetchProjectsTrends({ type, typeId, page, limit = 20 }) {
//         try {

//             const queryParam = getQueryParam(type, typeId)
//             const { data } = await JUSTFLIP.get(`/project/trends`, { params: { ...queryParam, page, limit } })
//             return data?.trends
//         } catch (error) {
//             handleApiError(error)
//         }
//     }

//     static async fetchTopProjects({ type, typeId, page = 1, limit = 20 }) {
//         try {
//             const queryParam = getQueryParam(type, typeId)
//             const { data } = await JUSTFLIP.get(`/project`, { params: { ...queryParam, status: "active", approval: "approved", page, limit, tag: "New Launches" } })
//             return data?.projects
//         } catch (error) {
//             handleApiError(error)
//         }
//     }

//     static async fetchProjectById(id) {
//         try {
//             const { data } = await JUSTFLIP.get(`/project/${id}`)
//             return data?.project
//         } catch (error) {
//             handleApiError(error)
//         }
//     }

//     static async fetchSimilarProjects({ id, page = 1, limit = 20 }) {
//         try {
//             const { data } = await JUSTFLIP.get(`project/similar?status=active&approval=approved&locationId=${id}&page=${page}&limit=${limit}`)
//             return data?.projects || []
//         } catch (error) {
//             handleApiError(error)
//         }
//     }

//     static async fetchProjectsBySearch({ search }) {
//         try {
//             const { data } = await JUSTFLIP.get(`/project`, { params: { search } })
//             return data?.projects || []
//         } catch (error) {
//             handleApiError(error)
//         }
//     }
// }

// export default ProjectService;

"use server";

import { JUSTFLIP } from "../lib/axios/api";
import { handleApiError } from "../lib/axios/apiError";
import { getQueryParam } from "../utils/getQueryParam";

export async function fetchProjectsByTag({ tag, cityId, page = 1, limit = 25 }) {
    try {
        const { data } = await JUSTFLIP.get("/project/tagged", {
            params: { tag, cityId, page, limit }
        });

        return data?.projects || [];
    } catch (error) {
        handleApiError(error);
    }
}

export async function fetchExploreProjects({ typeId, type, page = 1, limit = 25 }) {
    try {
        const queryParam = getQueryParam(type, typeId);

        const { data } = await JUSTFLIP.get("/project/explore-projects", {
            params: { typeId, type, page, limit, ...queryParam }
        });

        return data?.projects || [];
    } catch (error) {
        handleApiError(error);
    }
}

export async function fetchProjectsTrends({ type, typeId, page, limit = 20 }) {
    try {
        const queryParam = getQueryParam(type, typeId);

        const { data } = await JUSTFLIP.get("/project/trends", {
            params: { ...queryParam, page, limit }
        });

        return data?.trends || [];
    } catch (error) {
        handleApiError(error);
    }
}

export async function fetchTopProjects({ type, typeId, page = 1, limit = 20 }) {
    try {
        const queryParam = getQueryParam(type, typeId);

        const { data } = await JUSTFLIP.get("/project", {
            params: {
                ...queryParam,
                status: "active",
                approval: "approved",
                page,
                limit,
                tag: "New Launches"
            }
        });

        return data?.projects || [];
    } catch (error) {
        handleApiError(error);
    }
}

export async function fetchProjectById(id) {
    try {
        const { data } = await JUSTFLIP.get(`/project/${id}`);
        return data?.project || null;
    } catch (error) {
        handleApiError(error);
    }
}

export async function fetchSimilarProjects({ id, page = 1, limit = 20 }) {
    try {
        const { data } = await JUSTFLIP.get("/project/similar", {
            params: {
                status: "active",
                approval: "approved",
                locationId: id,
                page,
                limit
            }
        });

        return data?.projects || [];
    } catch (error) {
        handleApiError(error);
    }
}

export async function fetchProjectsBySearch({ search }) {
    try {
        const { data } = await JUSTFLIP.get("/project", {
            params: { search }
        });

        return data?.projects || [];
    } catch (error) {
        handleApiError(error);
    }
}
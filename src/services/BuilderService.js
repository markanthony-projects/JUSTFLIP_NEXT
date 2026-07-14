// import { JUSTFLIP } from "../lib/axios/api";
// import { handleApiError } from "../lib/axios/apiError";

// class BuilderService {
//   static async fetchBuilders({ cityId, page = 1, limit = 15 }) {
//     try {
//       const { data } = await JUSTFLIP.get(`/builder/top`, {
//         params: { cityId, page, limit },
//       });
//       return data;
//     } catch (error) {
//       handleApiError(error);
//       throw error;
//     }
//   }

//   static async fetchDevelopers({ page = 1, limit = 20, search = "", }) {
//     try {
//       const { data } = await JUSTFLIP.get(
//         `/builder`,
//         {
//           params: {
//             status: "active",
//             approval: "approved",
//             page,
//             limit,
//             search,
//           },
//         }
//       );
//       return data;
//     } catch (error) {
//       handleApiError(error);
//       throw error;
//     }
//   }

//   static async fetchDeveloperById(id) {
//     try {
//       const { data } = await JUSTFLIP.get(`/builder/${id}`);
//       return data;
//     } catch (error) {
//       handleApiError(error);
//       throw error;
//     }
//   }


//   static async fetchProjectByDeveloperId({ id, limit = 20, page = 1, tag }) {
//     try {
//       const { data } = await JUSTFLIP.get(`/project?status=active&approval=approved&builderId=${id}`, {
//         params: { page, limit },
//       });


//       return {
//         projects: data?.projects,
//         total: data?.total || 0,
//       };

//     } catch (error) {
//       handleApiError(error);
//       throw error;
//     }
//   }
// }

// export default BuilderService;

"use server";

import { JUSTFLIP } from "../lib/axios/api";
import { handleApiError } from "../lib/axios/apiError";

export async function fetchBuilders({ cityId, page = 1, limit = 15 }) {
    try {
        const { data } = await JUSTFLIP.get("/builder/top", {
            params: { cityId, page, limit }
        });

        return data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
}

export async function fetchTopBuilders({ cityId = null, zoneId = null, locationId = null, limit = 20 }) {
    try {
        const { data } = await JUSTFLIP.get("/builder/top", {
            params: { cityId, zoneId, locationId, limit }
        });

        return data;
    }
    catch (error) {
        handleApiError(error);
        throw error;
    }
}

export async function fetchDevelopers({ page = 1, limit = 20, search = "" }) {
    try {
        const { data } = await JUSTFLIP.get("/builder", {
            params: {
                status: "active",
                approval: "approved",
                page,
                limit,
                search
            }
        });

        return data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
}

export async function fetchDeveloperById(id) {
    try {
        const { data } = await JUSTFLIP.get(`/builder/${id}`);
        return data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
}

export async function fetchProjectByDeveloperId({ id, limit = 20, page = 1, tag }) {
    try {
        const { data } = await JUSTFLIP.get(
            `/project?status=active&approval=approved&builderId=${id}`,
            {
                params: { page, limit }
            }
        );

        return {
            projects: data?.projects,
            total: data?.total || 0
        };

    } catch (error) {
        handleApiError(error);
        throw error;
    }
}
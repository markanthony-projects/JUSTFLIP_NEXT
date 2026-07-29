import { cache } from "react";
import { unstable_cache } from "next/cache";
import CityService from "@/src/services/CityService";
import * as BuilderService from "@/src/services/BuilderService";
import ReviewService from "@/src/services/ReviewService";
import * as ProjectService from "@/src/services/ProjectService";
import ZoneService from "@/src/services/ZoneService";
import LocationService from "@/src/services/LocationService";

export const getCityPageData = cache(async (id) => {
  try {
    const results = await Promise.allSettled([
      CityService.getCityById(id),
      BuilderService.fetchTopBuilders({ cityId: id, limit: 20 }),
      ReviewService.getReviews({ type: "city", typeId: id }),
      ProjectService.fetchProjectsTrends({ typeId: id, type: "city", limit: 10, page: 1, }),
    ]);

    const cityData = results[0].status === "fulfilled" ? results[0].value : null;
    const builderRes = results[1].status === "fulfilled" ? results[1].value : null;
    const reviewData = results[2].status === "fulfilled" ? results[2].value : null;
    const trends = results[3].status === "fulfilled" ? results[3].value : null;

    results.forEach((res, index) => {
      if (res.status === "rejected") {
        console.error("City API Failure", {
          apiIndex: index,
          error: res.reason?.message || res.reason,
          cityId: id,
        });
      }
    });

    return {
      cityData,
      builders: builderRes?.builders || [],
      reviewData,
      reviewList: reviewData?.global || [],
      trends: trends || [],
    };

  } catch (error) {
    console.error("City Page Error", { message: error.message, stack: error.stack, cityId: id, });
  }
});

export const getZonePageData = cache(async (id) => {
  if (!id) {
    throw new Error("Zone ID is required");
  }

  try {
    const initialResults = await Promise.allSettled([
      ZoneService.getZoneById(id),
      ReviewService.getReviews({ type: "zone", typeId: id }),
      ProjectService.fetchProjectsTrends({ typeId: id, type: "zone", limit: 10, page: 1, }),
    ]);

    const zoneData = initialResults[0].status === "fulfilled" ? initialResults[0].value : null;
    const reviewData = initialResults[1].status === "fulfilled" ? initialResults[1].value : null;
    const trends = initialResults[2].status === "fulfilled" ? initialResults[2].value : null;
    const builderResult = zoneData?.city?.id
      ? await Promise.allSettled([
        BuilderService.fetchTopBuilders({ cityId: zoneData.city.id, limit: 20 })
      ])
      : [];
    const builderRes = builderResult[0]?.status === "fulfilled" ? builderResult[0].value : null;


    initialResults.forEach((res, index) => {
      if (res.status === "rejected") {
        console.error("Zone API Failure", {
          apiIndex: index,
          error: res.reason?.message || res.reason,
          zoneId: id,
        });
      }
    });
    if (builderResult[0]?.status === "rejected") {
      console.error("Zone Builder API Failure", {
        error: builderResult[0].reason?.message || builderResult[0].reason,
        cityId: zoneData?.city?.id,
        zoneId: id,
      });
    }


    return {
      zoneData,
      builders: builderRes?.builders || [],
      reviewData,
      reviewList: reviewData?.global || [],
      trends: trends || [],
    };
  } catch (error) {
    console.error("Zone Page Error", { message: error.message, stack: error.stack, zoneId: id, });
  }
});

export const getLocationPageData = cache(async (id) => {
  try {
    const results = await Promise.allSettled([
      LocationService.fetchLocationById({ id }),
      ReviewService.getReviews({ type: "location", typeId: id }),
      ProjectService.fetchProjectsTrends({ typeId: id, type: "location", limit: 10, page: 1, }),
    ]);

    const locationData = results[0].status === "fulfilled" ? results[0].value : null;
    const reviewData = results[1].status === "fulfilled" ? results[1].value : null;
    const trends = results[2].status === "fulfilled" ? results[2].value : null;
    const builderResult = locationData?.city?.id
      ? await Promise.allSettled([
        BuilderService.fetchTopBuilders({ cityId: locationData.city.id, limit: 20 })
      ])
      : [];
    const builderRes = builderResult[0]?.status === "fulfilled" ? builderResult[0].value : null;

    results.forEach((res, index) => {
      if (res.status === "rejected") {
        console.error(`API ${index} failed:`, res.reason);
      }
    });
    if (builderResult[0]?.status === "rejected") {
      console.error("Location Builder API Failure", {
        error: builderResult[0].reason?.message || builderResult[0].reason,
        cityId: locationData?.city?.id,
        locationId: id,
      });
    }


    return {
      locationData,
      builders: builderRes?.builders || [],
      reviewData,
      reviewList: reviewData?.global || [],
      trends: trends || [],
    };

  } catch (error) {
    console.error("Location Page Error:", { message: error.message, stack: error.stack, id, });
  }
});

export const getProjectPageData = unstable_cache(async (id) => {
  try {
    const projectData = await ProjectService.fetchProjectById(id);
    return { projectData };
  } catch (error) {
    console.error("Project Page Error:", { message: error.message, stack: error.stack, id, });
    return { projectData: null };
  }
}, ['project-page-data'], { revalidate: 3600 });

export const getProjectReviews = cache(async (id) => {
  try {
    return await ReviewService.getReviews({ type: "project", typeId: id });
  } catch (error) {
    console.error("Project Reviews Error:", error);
    return null;
  }
});

export const getLocationDetails = cache(async (locationId) => {
  if (!locationId) return null;
  try {
    return await LocationService.fetchLocationById({ id: locationId });
  } catch (error) {
    console.error("Location Details Error:", error);
    return null;
  }
});

export const getSimilarProjects = cache(async (locationId) => {
  if (!locationId) return [];
  try {
    return await ProjectService.fetchSimilarProjects({ id: locationId, page: 1, limit: 20 });
  } catch (error) {
    console.error("Similar Projects Error:", error);
    return [];
  }
});

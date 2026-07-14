import { cache } from "react";
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
      BuilderService.fetchBuilders({ id, page: 1, limit: 20 }),
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
    const results = await Promise.allSettled([
      ZoneService.getZoneById(id),
      BuilderService.fetchBuilders({ id, page: 1, limit: 20 }),
      ReviewService.getReviews({ type: "zone", typeId: id }),
      ProjectService.fetchProjectsTrends({ typeId: id, type: "zone", limit: 10, page: 1, }),
    ]);

    const zoneData = results[0].status === "fulfilled" ? results[0].value : null;
    const builderRes = results[1].status === "fulfilled" ? results[1].value : null;
    const reviewData = results[2].status === "fulfilled" ? results[2].value : null;
    const trends = results[3].status === "fulfilled" ? results[3].value : null;


    results.forEach((res, index) => {
      if (res.status === "rejected") {
        console.error("Zone API Failure", {
          apiIndex: index,
          error: res.reason?.message || res.reason,
          zoneId: id,
        });
      }
    });


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
      BuilderService.fetchBuilders({ id, page: 1, limit: 20 }),
      ReviewService.getReviews({ type: "location", typeId: id }),
      ProjectService.fetchProjectsTrends({ typeId: id, type: "location", limit: 10, page: 1, }),
    ]);

    const locationData = results[0].status === "fulfilled" ? results[0].value : null;
    const builderRes = results[1].status === "fulfilled" ? results[1].value : null;
    const reviewData = results[2].status === "fulfilled" ? results[2].value : null;
    const trends = results[3].status === "fulfilled" ? results[3].value : null;

    results.forEach((res, index) => {
      if (res.status === "rejected") {
        console.error(`API ${index} failed:`, res.reason);
      }
    });


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

export const getProjectPageData = cache(async (id) => {
  try {
    const projectData = await ProjectService.fetchProjectById(id);
    const locationId = projectData?.location?.id;

    const results = await Promise.allSettled([
      ReviewService.getReviews({ type: "project", typeId: id }),
      locationId ? LocationService.fetchLocationById({ id: locationId }) : Promise.resolve(null),
      locationId ? ProjectService.fetchSimilarProjects({ id: locationId, page: 1, limit: 20 }) : Promise.resolve([]),
    ]);

    const reviewData = results[0].status === "fulfilled" ? results[0].value : null;
    const locationData = results[1].status === "fulfilled" ? results[1].value : null;
    const similarProjects = results[2].status === "fulfilled" ? results[2].value : null;

    results.forEach((res, index) => {
      if (res.status === "rejected") {
        console.error(`API ${index} failed:`, res.reason);
      }
    });

    return { projectData, reviewData, locationData, similarProjects };

  } catch (error) {
    console.error("Project Page Error:", { message: error.message, stack: error.stack, id, });
  }
});
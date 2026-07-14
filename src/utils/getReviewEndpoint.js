export function getReviewEndpoint(type, id) {

  const endpoints = {
    city: `/city/review/${id}`,
    zone: `/zone/review/${id}`,
    location: `/location/review/${id}`,
    project: `/project/review/${id}`
  };

  return endpoints[type] || null;
}


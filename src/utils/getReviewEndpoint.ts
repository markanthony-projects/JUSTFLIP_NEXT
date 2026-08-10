export function getReviewEndpoint(type: string, id: string | number): string | null {

  const endpoints: Record<string, string> = {
    city: `/city/review/${id}`,
    zone: `/zone/review/${id}`,
    location: `/location/review/${id}`,
    project: `/project/review/${id}`
  };

  return endpoints[type] || null;
}


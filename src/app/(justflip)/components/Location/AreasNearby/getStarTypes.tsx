export default function getStarTypes(rating: number = 0): ("full" | "half" | "empty")[] {
  const stars: ("full" | "half" | "empty")[] = [];

  for (let i = 0; i < 5; i++) {
    if (i < Math.floor(rating)) stars.push("full");
    else if (i < Math.ceil(rating)) stars.push("half");
    else stars.push("empty");
  }

  return stars;
}
export default function getStarTypes(rating = 0) {
  const stars = [];

  for (let i = 0; i < 5; i++) {
    if (i < Math.floor(rating)) stars.push("full");
    else if (i < Math.ceil(rating)) stars.push("half");
    else stars.push("empty");
  }

  return stars;
}
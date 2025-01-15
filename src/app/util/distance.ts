/**
 * Obter distância em km do usuário até um determinado local
 */
export const calcDistance = (userLatitude: number, userLongitude: number, placeLatitude: number, placeLongitude: number): number => {
  if (!userLatitude || !userLongitude || !placeLatitude || !placeLongitude) {
    return 0;
  }
  const earthRadiusKm = 6371; // Radius of the Earth in kilometers

  // Convert latitude and longitude to radians
  const userLatRad = degreesToRadians(userLatitude);
  const userLonRad = degreesToRadians(userLongitude);
  const placeLatRad = degreesToRadians(placeLatitude);
  const placeLonRad = degreesToRadians(placeLongitude);

  // Calculate the differences between the latitudes and longitudes
  const latDiff = placeLatRad - userLatRad;
  const lonDiff = placeLonRad - userLonRad;

  // Use the Haversine formula to calculate the distance
  const a = Math.sin(latDiff / 2) ** 2 + Math.cos(userLatRad) * Math.cos(placeLatRad) * Math.sin(lonDiff / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadiusKm * c;

  return distance; // Distance in kilometers
};

const degreesToRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

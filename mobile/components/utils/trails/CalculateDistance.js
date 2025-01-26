const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const calculateTotalDistance = (coordinates) => {
  let totalDistance = 0;
  for (let i = 0; i < coordinates.length - 1; i++) {
    totalDistance += calculateDistance(
      coordinates[i].latitude,
      coordinates[i].longitude,
      coordinates[i + 1].latitude,
      coordinates[i + 1].longitude
    );
  }
  return totalDistance;
};

const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  return `${distance.toFixed(2)} km`;
};

const formatDistanceWithUnit = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
};

const calculateBounds = (coordinates) => {
  if (!coordinates || coordinates.length === 0) return null;

  return coordinates.reduce(
    (acc, coord) => ({
      ne: [
        Math.max(acc.ne[0], coord[0]),
        Math.max(acc.ne[1], coord[1])
      ],
      sw: [
        Math.min(acc.sw[0], coord[0]),
        Math.min(acc.sw[1], coord[1])
      ]
    }),
    {
      ne: [coordinates[0][0], coordinates[0][1]],
      sw: [coordinates[0][0], coordinates[0][1]]
    }
  );
};

export {
  calculateDistance,
  calculateTotalDistance,
  formatDistance,
  formatDistanceWithUnit,
  calculateBounds
}; 
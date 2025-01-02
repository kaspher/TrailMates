import { BASE_URL } from "../config";

export const fetchTrails = async (bounds, filters) => {
  const _sw = bounds.getSouthWest();
  const _ne = bounds.getNorthEast();

  const { trailTypes } = filters;
  const activeTrailTypes = Object.entries(trailTypes)
    .filter(([_, value]) => value)
    .map(([key]) => key);

  const trailTypesQuery = activeTrailTypes
    .map((type) => `TrailTypes=${encodeURIComponent(type)}`)
    .join("&");

  try {
    const response = await fetch(
      `${BASE_URL}/trails?MinimumLatitude=${_sw.lat}&MaximumLatitude=${_ne.lat}&MinimumLongitude=${_sw.lng}&MaximumLongitude=${_ne.lng}&${trailTypesQuery}`
    );
    if (!response.ok) throw new Error("Failed to fetch trails");
    return await response.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

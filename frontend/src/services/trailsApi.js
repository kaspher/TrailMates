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
      `${BASE_URL}/trails?MinimumLatitude=${_sw.lat}&MaximumLatitude=${_ne.lat}
      &MinimumLongitude=${_sw.lng}&MaximumLongitude=${_ne.lng}&${trailTypesQuery}&Visibility=Public`
    );
    if (!response.ok) throw new Error("Failed to fetch trails");
    return await response.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getTrailById = async (trailId) => {
  const response = await fetch(`${BASE_URL}/trails/${trailId}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

export const fetchUserTrails = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/trails?UserId=${userId}`);
    if (!response.ok) throw new Error("Failed to fetch user trails");
    return await response.json();
  } catch (error) {
    console.error("Error fetching user trails:", error);
    throw error;
  }
};

export const fetchPrivateUserTrails = async (userId) => {
  const response = await fetch(
    `${BASE_URL}/trails?UserId=${userId}&Visibility=Private`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

export const fetchPublicUserTrails = async (userId) => {
  const response = await fetch(
    `${BASE_URL}/trails?UserId=${userId}&Visibility=Public`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

export const fetchTrailCompletions = async (userId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/trails/completions?UserId=${userId}`
    );
    if (!response.ok) throw new Error("Failed to fetch trail completions");
    return await response.json();
  } catch (error) {
    console.error("Error fetching trail completions:", error);
    throw error;
  }
};

export const updateTrail = async (trailId, data) => {
  const response = await fetch(`${BASE_URL}/trails/${trailId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: data.name,
      type: data.type,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};

export const updateTrailVisibility = async (trailId) => {
  const response = await fetch(`${BASE_URL}/trails/${trailId}/visibility`, {
    method: "PUT",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};

export const deleteTrail = async (trailId) => {
  try {
    const response = await fetch(`${BASE_URL}/trails/${trailId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error deleting trail:", error);
    throw error;
  }
};

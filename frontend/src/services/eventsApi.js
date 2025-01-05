import { BASE_URL } from "../config";

export const fetchEvents = async (filters) => {
  const queryParams = new URLSearchParams();
  if (filters.startDateFrom)
    queryParams.append("startDateFrom", filters.startDateFrom);
  if (filters.startDateTo)
    queryParams.append("startDateTo", filters.startDateTo);
  if (filters.participantsLimitFrom)
    queryParams.append("participantsLimitFrom", filters.participantsLimitFrom);
  if (filters.participantsLimitTo)
    queryParams.append("participantsLimitTo", filters.participantsLimitTo);
  if (filters.trailId) queryParams.append("TrailId", filters.trailId);

  const activeTrailTypes = Object.entries(filters.trailTypes || {})
    .filter(([_, value]) => value)
    .map(([key]) => key);
  activeTrailTypes.forEach((type) => queryParams.append("TrailTypes", type));

  const activeStatuses = Object.entries(filters.statuses || {})
    .filter(([_, value]) => value)
    .map(([key]) => key);
  activeStatuses.forEach((status) => queryParams.append("Statuses", status));

  queryParams.append("sortBy", filters.sortBy);
  queryParams.append("sortDescending", filters.sortDescending);
  queryParams.append("page", filters.page);
  queryParams.append("pageSize", filters.pageSize);

  const response = await fetch(`${BASE_URL}/events?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }
  return response.json();
};

export const fetchUserEvents = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/events?UserId=${userId}`);
    if (!response.ok) throw new Error("Failed to fetch user events");
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("Error fetching user events:", error);
    throw error;
  }
};

export const joinEvent = async (eventId, userId) => {
  const response = await fetch(`${BASE_URL}/events/${eventId}/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userId),
  });
  if (!response.ok) {
    throw new Error("Failed to join event");
  }
};

export const leaveEvent = async (eventId, userId) => {
  console.log(eventId, userId);
  const response = await fetch(`${BASE_URL}/events/${eventId}/leave`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userId),
  });
  if (!response.ok) {
    throw new Error("Failed to leave event");
  }
};

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
  queryParams.append("sortBy", filters.sortBy);
  queryParams.append("sortDescending", filters.sortDescending);
  queryParams.append("page", filters.page);
  queryParams.append("pageSize", filters.pageSize);

  const response = await fetch(`${BASE_URL}events?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }
  return response.json();
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
  const response = await fetch(`${BASE_URL}/api/events/${eventId}/leave`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userId),
  });
  if (!response.ok) {
    throw new Error("Failed to leave event");
  }
};

import { BASE_URL } from "../config";

export const getAllActivities = async (page = 1, pageSize = 20) => {
  const response = await fetch(`${BASE_URL}/activities?Page=${page}&PageSize=${pageSize}`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  return data.items || [];
};

export const getTrailById = async (trailId) => {
  const response = await fetch(`${BASE_URL}/trails/${trailId}`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
};

export const updateActivity = async (activityId, formData) => {
  const response = await fetch(`${BASE_URL}/activities/${activityId}`, {
    method: 'PUT',
    body: formData
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
};

export const deleteActivity = async (activityId) => {
  const response = await fetch(`${BASE_URL}/activities/${activityId}`, {
    method: 'DELETE'
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return true;
};

export const publishActivity = async (activityId, visibility) => {
  const response = await fetch(`${BASE_URL}/activities/${activityId}/publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ visibility })
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
};

export const addLike = async (activityId, userId) => {
  const response = await fetch(`${BASE_URL}/activities/${activityId}/likes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userId)
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
};

export const addComment = async (activityId, userId, content) => {
  const response = await fetch(`${BASE_URL}/activities/${activityId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      userId: userId,
      content: content
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return await response.json();
};

export const getComments = async (activityId) => {
  const response = await fetch(`${BASE_URL}/activities/${activityId}/comments`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
};

export const getLikes = async (activityId) => {
  const response = await fetch(`${BASE_URL}/activities/${activityId}/likes`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
};

export const getUserById = async (userId) => {
  const response = await fetch(`${BASE_URL}/users/${userId}`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}; 
import { BASE_URL } from "../config";

export const getAllActivities = async (page, pageSize) => {
  try {
    const response = await fetch(
      `${BASE_URL}/activities?page=${page}&pageSize=${pageSize}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch activities");
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("Error fetching activities:", error);
    throw error;
  }
};

export const fetchActivity = async (activityId) => {
  try {
    const response = await fetch(`${BASE_URL}/activities/${activityId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch activity");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching activity:", error);
    throw error;
  }
};

export const updateActivity = async (activityId, formData) => {
  const response = await fetch(`${BASE_URL}/activities/${activityId}`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

export const deleteActivity = async (activityId) => {
  const response = await fetch(`${BASE_URL}/activities/${activityId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return true;
};

export const addLike = async (activityId, userId) => {
  try {
    const response = await fetch(`${BASE_URL}/activities/${activityId}/likes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userId),
    });

    if (!response.ok) {
      throw new Error("Failed to add like");
    }

    return {
      userId: userId,
      activityId: activityId,
    };
  } catch (error) {
    console.error("Error adding like:", error);
    throw error;
  }
};

export const addComment = async (activityId, userId, content) => {
  try {
    const response = await fetch(
      `${BASE_URL}/activities/${activityId}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, content }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to add comment");
    }
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

export const createActivity = async (formData) => {
  try {
    const response = await fetch(`${BASE_URL}/activities`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to create activity");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating activity:", error);
    throw error;
  }
};

export const removeLike = async (likeId) => {
  try {
    const response = await fetch(`${BASE_URL}/activities/likes/${likeId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to remove like");
    }

    return true;
  } catch (error) {
    console.error("Error removing like:", error);
    throw error;
  }
};

export const deleteComment = async (commentId) => {
  try {
    const response = await fetch(`${BASE_URL}/activities/comments/${commentId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete comment');
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

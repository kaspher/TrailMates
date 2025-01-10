import { BASE_URL } from "../config";

export const getPostById = async (postId) => {
  const response = await fetch(`${BASE_URL}/api/trails/${postId}`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
};

export const getAllPosts = async () => {
  const response = await fetch(`${BASE_URL}/api/trails`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
};

export const updatePostVisibility = async (postId, visibility) => {
  const response = await fetch(`${BASE_URL}/api/trails/${postId}/visibility`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ visibility })
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}; 
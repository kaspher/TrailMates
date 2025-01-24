//export const API_URL = 'http://192.168.0.175:5253';
 export const API_URL = 'http://10.0.2.2:5253';

export const endpoints = {
  users: (userId) => `${API_URL}/api/users/${userId}`,
  updateUser: (userId) => `${API_URL}/api/users/${userId}/update-profile`,
  userAvatar: (userId) => `${API_URL}/api/users/${userId}/avatar`,
  trails: `${API_URL}/api/trails`,
  trailDetails: (trailId) => `${API_URL}/api/trails/${trailId}`,
  trailVisibility: (trailId) => `${API_URL}/api/trails/${trailId}/visibility`,
  auth: {
    login: `${API_URL}/api/account/login`,
    register: `${API_URL}/api/account/register`,
    validate: `${API_URL}/api/account/validate`,
    resetPassword: `${API_URL}/api/account/reset-password`
  }
}; 
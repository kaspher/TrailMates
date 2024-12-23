import { BASE_URL } from "../config";

export const getUserById = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}`);
    if (!response.ok) {
      throw new Error("Błąd podczas pobierania danych użytkownika");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (userId, userData) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}/update-profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error("Błąd podczas aktualizacji danych osobowych");
    }
  } catch (error) {
    throw error;
  }
};

export const updateUserProfilePicture = async (userId, file) => {
  const formData = new FormData();
  formData.append("picture", file);

  try {
    const response = await fetch(
      `${BASE_URL}/users/${userId}/update-profile-picture`,
      {
        method: "POST",
        body: formData,
      }
    );
    if (!response.ok) {
      throw new Error("Błąd podczas aktualizacji avatara");
    }
  } catch (error) {
    throw error;
  }
};

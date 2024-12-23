import { BASE_URL } from "../config";

export const fetchTrails = async () => {
  try {
    const response = await fetch(`${BASE_URL}/trails`);
    if (!response.ok) {
      throw new Error("Błąd podczas pobierania tras");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

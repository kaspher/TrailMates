import { jwtDecode } from "jwt-decode";

export const decodeToken = (token) => {
  const decodedToken = jwtDecode(token);
  return {
    id: decodedToken.id,
    name: decodedToken.unique_name,
  };
};

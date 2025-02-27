import { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { decodeToken } from "../../utils/jwtHelpers";
import { BASE_URL } from "../../config";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem("access_token") || ""
  );
  const navigate = useNavigate();

  const logOut = useCallback(() => {
    setUser(null);
    setToken("");
    localStorage.removeItem("access_token");
    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
      try {
        const userData = decodeToken(storedToken);
        setUser(userData);
        setToken(storedToken);
      } catch (error) {
        console.error("Invalid token", error);
        logOut();
      }
    }
  }, [logOut]);

  const loginAction = async (email, password, setEmailError) => {
    try {
      const response = await fetch(`${BASE_URL}/account/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        if (response.status === 400 || response.status === 404) {
          setEmailError("Podany adres email lub hasło są nie poprawne!");
          return;
        }
        setEmailError("Wystąpił błąd. Spróbuj ponownie.");
        return;
      }

      const accessToken = await response.json();

      if (accessToken) {
        const decodedToken = decodeToken(accessToken);
        const userData = {
          id: decodedToken.id,
          name: decodedToken.unique_name,
        };
        setUser(userData);
        setToken(accessToken);
        localStorage.setItem("access_token", accessToken);
        navigate("/");
      }
    } catch (err) {
      setEmailError("Wystąpił błąd. Spróbuj ponownie.");
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, loginAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

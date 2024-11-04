import {useContext, createContext, useState, useEffect, useCallback} from "react";
import {useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode"; 

const AuthContext = createContext(null);

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("access_token") || "");
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
                const decodedToken = jwtDecode(storedToken);
                const userData = {
                    id: decodedToken.id,
                    name: decodedToken.unique_name,
                };
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
            const response = await fetch("https://localhost:7186/api/account/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email, password}),
            });

            if (!response.ok) {
                if (response.status === 404) {
                    setEmailError("Podany adres email lub hasło są nie poprawne!");
                    return;
                }
                setEmailError("Wystąpił błąd. Spróbuj ponownie.");
                return;
            }

            const accessToken = await response.json();

            if (accessToken) {
                const decodedToken = jwtDecode(accessToken);
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
        <AuthContext.Provider value={{token, user, loginAction, logOut}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};

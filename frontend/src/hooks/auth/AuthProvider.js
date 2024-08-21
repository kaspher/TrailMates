import {useContext, createContext, useState} from "react";
import {useNavigate} from "react-router-dom";

const AuthContext = createContext(null);

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("access_token") || "");
    const navigate = useNavigate();

    const loginAction = async (email, password, setEmailError) => {
        try {
            const response = await fetch("https://localhost:7186/api/account/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email, password}),
            });
            if(!response.ok){
                if (response.status === 404) {
                    setEmailError("Użytkownik o podanym adresie email lub haśle nie istnieje!");
                    return;
                }
                setEmailError("Wystąpił błąd. Spróbuj ponownie.");
                return;
            }

            const accessToken = await response.json();

            if (accessToken) {
                setUser(email);
                setToken(accessToken);
                localStorage.setItem("access_token", accessToken);
                navigate("/");
            }
        } catch (err) {
            setEmailError("Wystąpił błąd. Spróbuj ponownie.");
        }
    };

    const logOut = () => {
        setUser(null);
        setToken("");
        localStorage.removeItem("access_token");
        navigate("/login");
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
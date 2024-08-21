import { useNavigate } from 'react-router-dom';

export const useRegistration = () => {
    const navigate = useNavigate();

    const registerUser = async (userData, setEmailError) => {
        try {
            const response = await fetch("https://localhost:7186/api/account/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            if (response.status === 400) {
                setEmailError("Użytkownik o podanym adresie email już istnieje!");
                return;
            }

            navigate("/login");

        } catch (err) {
            setEmailError("Wystąpił błąd. Spróbuj ponownie.");
        }
    };

    return { registerUser };
};

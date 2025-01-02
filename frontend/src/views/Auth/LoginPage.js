import React, { useState } from "react";
import { Link } from "react-router-dom";
import { InputField } from "../../components/UI/InputField";
import { useAuth } from "../../hooks/useAuth";
import { loginFormValidator } from "../../utils/validators";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const auth = useAuth();

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const isFormValid = loginFormValidator(
      email,
      password,
      setEmailError,
      setPasswordError
    );
    if (!isFormValid) return;

    void auth.loginAction(email, password, setEmailError);
  };

  return (
    <div className="bg-gray-100 flex justify-center items-center h-screen">
      <div className="w-1/2 h-screen hidden lg:block">
        <img
          src="https://placehold.co/800x/667fff/ffffff.png?text=Your+Image&font=Montserrat"
          alt="Placeholder"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
        <h1 className="text-5xl text-center text-green-800 font-bold mb-10">
          Logowanie
        </h1>
        <form method="POST" onSubmit={handleSubmit}>
          <InputField
            id="email"
            type="email"
            label="Adres e-mail"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <p className="text-red-700 mb-5">{emailError}</p>
          <InputField
            id="password"
            type="password"
            label="Hasło"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
          <p className="text-red-700 mb-5">{passwordError}</p>
          <button
            type="submit"
            className="bg-green-800 hover:bg-green-950 text-white font-semibold rounded-md py-2 px-4 w-full"
          >
            Zaloguj się
          </button>
        </form>
        <div className="mt-6 text-blue-500 text-center">
          <Link to="/register" className="hover:underline">
            Zarejestruj się tutaj!
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { InputField } from "../../components/UI/InputField";
import { registrationFormValidator } from "../../utils/validators";
import { useRegistration } from "../../hooks/useRegistration";

function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("Mężczyzna");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [genderError, setGenderError] = useState("");

  const { registerUser } = useRegistration();

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const isFormValid = registrationFormValidator(
      firstName,
      lastName,
      email,
      password,
      gender,
      setFirstNameError,
      setLastNameError,
      setEmailError,
      setPasswordError,
      setGenderError
    );
    if (!isFormValid) return;

    const userData = {
      email,
      firstName,
      lastName,
      gender,
      password,
    };

    void registerUser(userData, setEmailError);
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
          Rejestracja
        </h1>
        <form method="POST" onSubmit={handleSubmit}>
          <InputField
            id="firstName"
            type="text"
            label="Imię"
            value={firstName}
            onChange={(ev) => setFirstName(ev.target.value)}
          />
          <p className="text-red-700 mb-5">{firstNameError}</p>
          <InputField
            id="lastName"
            type="text"
            label="Nazwisko"
            value={lastName}
            onChange={(ev) => setLastName(ev.target.value)}
          />
          <p className="text-red-700 mb-5">{lastNameError}</p>
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
          <div className="mb-5">
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700"
            >
              Płeć
            </label>
            <select
              id="gender"
              name="gender"
              value={gender}
              onChange={(ev) => setGender(ev.target.value)}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            >
              <option value="Mężczyzna">Mężczyzna</option>
              <option value="Kobieta">Kobieta</option>
              <option value="Inne">Inne</option>
            </select>
            <p className="text-red-700">{genderError}</p>
          </div>
          <button
            type="submit"
            className="bg-green-800 hover:bg-green-950 text-white font-semibold rounded-md py-2 px-4 w-full"
          >
            Zarejestruj się
          </button>
        </form>
        <div className="mt-6 text-center">
          Masz już konto?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Zaloguj się tutaj!
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;

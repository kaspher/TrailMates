export const loginFormValidator = (
  email,
  password,
  setEmailError,
  setPasswordError
) => {
  setEmailError("");
  setPasswordError("");

  let isValid = true;

  if ("" === email) {
    setEmailError("Wprowadź adres e-mail");
    isValid = false;
  }

  if ("" === password) {
    setPasswordError("Wprowadź hasło");
    isValid = false;
  }

  return isValid;
};

export const registrationFormValidator = (
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
) => {
  setFirstNameError("");
  setLastNameError("");
  setEmailError("");
  setPasswordError("");
  setGenderError("");

  let isValid = true;

  if ("" === firstName) {
    setFirstNameError("Podaj imię");
    isValid = false;
  }

  if ("" === lastName) {
    setLastNameError("Podaj nazwisko");
    isValid = false;
  }

  if ("" === email) {
    setEmailError("Podaj adres e-mail");
    isValid = false;
  } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    setEmailError("Podaj prawidłowy adres e-mail");
    isValid = false;
  }

  if ("" === password) {
    setPasswordError("Podaj hasło");
    isValid = false;
  } else if (password.length < 5) {
    setPasswordError("Hasło musi mieć co najmniej 5 znaków");
    isValid = false;
  }

  if ("" === gender && gender.length < 3) {
    setGenderError("Podaj płeć");
    isValid = false;
  }

  return isValid;
};

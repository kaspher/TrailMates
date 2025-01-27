export const validateLoginInputs = (email, password, setAlertMessage) => {
  
  if (email !== validEmail) {
    setAlertMessage('Niepoprawny adres e-mail!');
    return false;
  }
  
  if (password !== validPassword) {
    setAlertMessage('Niepoprawne hasło!');
    return false;
  }
  
  setAlertMessage('Zalogowano pomyślnie!');
  return true;
  };
  
export const validateRegisterInputs = (formData, setAlertMessage) => {
    const { firstName, lastName, email, password, confirmPassword} = formData;
  
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setAlertMessage('Wszystkie pola są wymagane!');
      return false;
    }
  
    if (!email.includes('@')) {
      setAlertMessage('Niepoprawny adres e-mail!');
      return false;
    }
  
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      setAlertMessage('Hasło musi zawierać dużą literę, małą literę i cyfrę.');
      return false;
    }
  
    if (password !== confirmPassword) {
      setAlertMessage('Hasła nie pasują do siebie!');
      return false;
    }
  
    setAlertMessage('Rejestracja udana!');
    return true;
  };

  export const validateResetEmail = (email, setAlertMessage) => {
    if (!email.includes('@')) {
      setAlertMessage('Wprowadź poprawny adres e-mail.');
      return false;
    }
    setAlertMessage('Instrukcja resetowania hasła została wysłana na podany adres e-mail.');
    return true;
  };

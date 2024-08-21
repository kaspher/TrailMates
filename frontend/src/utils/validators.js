export const loginFormValidator = (email, password, setEmailError, setPasswordError) => {
    setEmailError('');
    setPasswordError('');

    let isValid = true;

    if ('' === email) {
        setEmailError('Please enter your email');
        isValid = false;
    }

    if ('' === password) {
        setPasswordError('Please enter a password');
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
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
    setPasswordError('');
    setGenderError('');

    let isValid = true;

    if ('' === firstName) {
        setFirstNameError('Please enter your first name');
        isValid = false;
    }

    if ('' === lastName) {
        setLastNameError('Please enter your last name');
        isValid = false;
    }

    if ('' === email) {
        setEmailError('Please enter your email');
        isValid = false;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        setEmailError('Please enter a valid email');
        isValid = false;
    }

    if ('' === password) {
        setPasswordError('Please enter a password');
        isValid = false;
    } else if (password.length < 5) {
        setPasswordError('The password must be 8 characters or longer');
        isValid = false;
    }

    if ('' === gender) {
        setGenderError('Please select a valid gender');
        isValid = false;
    }

    return isValid;
};
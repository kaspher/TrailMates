import React, { useState, useEffect, useRef } from "react";
import CustomAlert from "../CustomAlert";
import { useAuth } from "../../hooks/auth/AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

const cloudFrontDomainName = process.env.REACT_APP_CLOUDFRONT_DOMAIN_NAME;

const UserProfile = () => {
  const { user } = useAuth();
  const alertRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);
  const [profilePicture, setProfilePicture] = useState();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    country: "",
    city: "",
  });
  const [initialData, setInitialData] = useState({ ...formData });
  const [showAvatarSaveButton, setShowAvatarSaveButton] = useState(false);
  const [showFormSaveButton, setShowFormSaveButton] = useState(false);

  useEffect(() => {
    if (user) {
      setProfilePicture(cloudFrontDomainName + user.id);
      const fetchUserData = async () => {
        try {
          const response = await fetch(
            `https://localhost:7186/api/users/${user.id}`
          );
          if (response.ok) {
            const userData = await response.json();
            setFormData(userData);
            setInitialData(userData);
          } else {
            if (alertRef.current)
              alertRef.current.showAlert(
                "Błąd podczas pobierania danych użytkownika",
                "error"
              );
          }
        } catch (error) {
          if (alertRef.current)
            alertRef.current.showAlert(
              "Wystąpił błąd podczas pobierania danych użytkownika",
              "error"
            );
        }
      };

      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    const hasFormChanged = Object.keys(formData).some(
      (key) => formData[key] !== initialData[key]
    );
    setShowFormSaveButton(hasFormChanged);
  }, [formData, initialData]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = async () => {
    try {
      const response = await fetch(
        `https://localhost:7186/api/users/${user.id}/update-profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        if (alertRef.current)
          alertRef.current.showAlert(
            "Dane osobowe zostały zaktualizowane!",
            "success"
          );
        setInitialData({ ...formData });
        setShowFormSaveButton(false);
      } else {
        if (alertRef.current)
          alertRef.current.showAlert(
            "Błąd podczas aktualizacji danych osobowych",
            "error"
          );
      }
    } catch (error) {
      if (alertRef.current)
        alertRef.current.showAlert(
          "Wystąpił błąd podczas aktualizacji danych osobowych",
          "error"
        );
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setShowAvatarSaveButton(!!file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarSubmit = async () => {
    if (!selectedFile) return;

    const avatarFormData = new FormData();
    avatarFormData.append("picture", selectedFile);

    try {
      const response = await fetch(
        `https://localhost:7186/api/users/${user.id}/update-profile-picture`,
        {
          method: "POST",
          body: avatarFormData,
        }
      );

      if (response.ok) {
        if (alertRef.current)
          alertRef.current.showAlert(
            "Avatar został zaktualizowany!",
            "success"
          );
        setShowAvatarSaveButton(false);
      } else {
        if (alertRef.current)
          alertRef.current.showAlert(
            "Błąd podczas aktualizacji avatara",
            "error"
          );
      }
    } catch (error) {
      if (alertRef.current)
        alertRef.current.showAlert(
          "Wystąpił błąd podczas aktualizacji avatara",
          "error"
        );
    }
  };

  return user ? (
    <div className="container mx-auto mt-6 p-4 flex flex-col lg:flex-row gap-6 justify-center items-start">
      <div className="w-full lg:w-1/4">
        <div className="bg-white p-4 pb-6 rounded-lg shadow-md h-auto">
          <div className="flex flex-col items-center space-y-2">
            <label
              htmlFor="avatar"
              className="relative p-1 border-4 border-green-500 rounded-full cursor-pointer"
            >
              <img
                src={profilePicture}
                alt="avatar"
                className="h-24 w-24 rounded-full object-cover"
              />
              <FontAwesomeIcon
                icon={faCamera}
                className="absolute bottom-1 right-0 text-green-500 bg-white rounded-full p-1"
                size="lg"
              />
              <input
                type="file"
                id="avatar"
                accept="image/png, image/jpeg"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>

            <div className="relative flex items-center group">
              <FontAwesomeIcon
                icon={faInfoCircle}
                className="text-gray-500 cursor-pointer"
              />
              <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity w-40 text-center">
                JPG lub PNG. 2MB max.
              </div>
            </div>

            {showAvatarSaveButton && (
              <button
                onClick={handleAvatarSubmit}
                className="bg-green-600 text-white py-1 px-3 rounded-lg hover:bg-green-700 transition-all text-sm"
              >
                Zapisz
              </button>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md mt-4">
          <h3 className="text-center text-lg font-semibold text-gray-700">
            Twoje odznaki
          </h3>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="flex flex-col items-center">
              <img
                src={require("../../assets/img/golden_cup.png")}
                alt="Odznaka 1"
                className="h-14 w-14 object-cover rounded"
              />
              <span className="text-xs mt-1 text-gray-600">Odznaka 1</span>
            </div>
            <div className="flex flex-col items-center">
              <img
                src={require("../../assets/img/silver_medal.png")}
                alt="Odznaka 2"
                className="h-14 w-14 object-cover rounded"
              />
              <span className="text-xs mt-1 text-gray-600">Odznaka 2</span>
            </div>
            <div className="flex flex-col items-center">
              <img
                src={require("../../assets/img/golden_cup.png")}
                alt="Odznaka 3"
                className="h-14 w-14 object-cover rounded"
              />
              <span className="text-xs mt-1 text-gray-600">Odznaka 3</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-3/4 max-w-2xl bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Dane osobowe
        </h2>
        <form className="space-y-3">
          <div>
            <label className="block text-gray-600">Imię</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleFormChange}
              className="w-full border border-gray-300 rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="block text-gray-600">Nazwisko</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleFormChange}
              className="w-full border border-gray-300 rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="block text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              className="w-full border border-gray-300 rounded-lg p-2 mt-1 bg-gray-100 text-gray-500 cursor-not-allowed pointer-events-none select-none"
            />
          </div>

          <div>
            <label className="block text-gray-600">Płeć</label>
            <input
              type="text"
              name="gender"
              value={formData.gender}
              onChange={handleFormChange}
              className="w-full border border-gray-300 rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="block text-gray-600">Kraj</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleFormChange}
              className="w-full border border-gray-300 rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="block text-gray-600">Miasto</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleFormChange}
              className="w-full border border-gray-300 rounded-lg p-2 mt-1"
            />
          </div>

          {showFormSaveButton && (
            <button
              type="button"
              onClick={handleFormSubmit}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all mt-4"
            >
              Zapisz dane
            </button>
          )}
        </form>
      </div>
      <CustomAlert ref={alertRef} />
    </div>
  ) : (
    <div>Loading ...</div>
  );
};

export default UserProfile;

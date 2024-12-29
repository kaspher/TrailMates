import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, SafeAreaView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import Alert from '../utils/Alert';

const UserProfile = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    country: '',
    city: ''
  });
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    const loadTokenAndData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        
        if (token) {
          const decoded = jwtDecode(token);
          console.log('Decoded Token:', decoded);

          if (decoded && decoded.unique_name) {
            setUserName(decoded.unique_name);

            const userId = decoded.id;
            const response = await fetch(`http://10.0.2.2:5253/api/users/${userId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            if (response.ok) {
              const data = await response.json();
              setUserData(data);
              setFormData({
                firstName: data.firstName,
                lastName: data.lastName,
                gender: data.gender,
                country: data.country,
                city: data.city
              });
            } else {
              console.error('Błąd pobierania danych użytkownika:', response.statusText);
            }
          }
        } else {
          console.log('Token nie znaleziono!');
        }
      } catch (error) {
        console.error('Błąd podczas odczytywania tokenu lub pobierania danych:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTokenAndData();
  }, []);

  const handleInputChange = (name, value) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      setAlertMessage("Nie znaleziono tokenu autoryzacyjnego.");
      return;
    }

    const userId = jwtDecode(token).id;
    const updatedData = {
      ...formData,
      email: userData.email
    };

    setIsSaving(true);

    try {
      const response = await fetch(`http://10.0.2.2:5253/api/users/${userId}/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        setUserData(updatedData);
        setAlertMessage("Dane zostały zaktualizowane.");
      } else {
        setAlertMessage("Nie udało się zaktualizować danych.");
      }
    } catch (error) {
      console.error('Błąd podczas zapisywania danych:', error);
      setAlertMessage("Wystąpił błąd podczas zapisywania danych.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      navigation.replace('Login');
    } catch (error) {
      console.error('Błąd przy wylogowaniu:', error);
      setAlertMessage('Nie udało się wylogować.');
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-secondary">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 h-screen w-screen bg-light">
      <View className="flex-1 justify-center items-center bg-light p-4">
        <Text className="text-2xl font-bold mb-4">Witaj, {userName || 'gościu'}</Text>
        {alertMessage && <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />}

        {userData ? (
          <View className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
            <TextInput
              className="border border-gray-300 rounded-md p-3 mb-4 font-regular"
              placeholder="Imię"
              value={formData.firstName}
              onChangeText={(text) => handleInputChange('firstName', text)}
            />
            <TextInput
              className="border border-gray-300 rounded-md p-3 mb-4 font-regular"
              placeholder="Nazwisko"
              value={formData.lastName}
              onChangeText={(text) => handleInputChange('lastName', text)}
            />
            <TextInput
              className="border border-gray-300 rounded-md p-3 mb-4 font-regular"
              placeholder="Płeć"
              value={formData.gender}
              onChangeText={(text) => handleInputChange('gender', text)}
            />
            <TextInput
              className="border border-gray-300 rounded-md p-3 mb-4 font-regular"
              placeholder="Kraj"
              value={formData.country}
              onChangeText={(text) => handleInputChange('country', text)}
            />
            <TextInput
              className="border border-gray-300 rounded-md p-3 mb-4 font-regular"
              placeholder="Miasto"
              value={formData.city}
              onChangeText={(text) => handleInputChange('city', text)}
            />

            <TouchableOpacity
              className={`bg-primary p-4 rounded-md ${isSaving ? 'opacity-50' : ''}`}
              onPress={handleSaveChanges}
              disabled={isSaving}
            >
              <Text className="text-white text-center font-bold">
                {isSaving ? 'Zapisuję...' : 'Zapisz zmiany'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-red-500 p-4 rounded-md mt-4"
              onPress={handleLogout}
            >
              <Text className="text-white text-center font-bold">
                Wyloguj się
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text className="text-dark">Nie udało się pobrać danych użytkownika.</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default UserProfile;

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, SafeAreaView, TextInput, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import Alert from '../utils/Alert';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GoBackArrow from '../utils/GoBackArrow';
import { getAvatarUrl } from '../utils/GetAvatarUrl';
import { endpoints } from '../../config';

const UserProfile = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    country: '',
    city: ''
  });
  const [imageError, setImageError] = useState(false);

  const insets = useSafeAreaInsets();

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const decoded = jwtDecode(token);
      const currentUserId = decoded.id;
      setUserId(currentUserId);
      
      setImageError(false);
      setAvatarUrl(getAvatarUrl(currentUserId));

      const response = await fetch(endpoints.users(currentUserId));
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          gender: data.gender || '',
          country: data.country || '',
          city: data.city || ''
        });
      }
    } catch (error) {
      console.error('Błąd podczas pobierania danych użytkownika:', error);
      setAlertMessage('Nie udało się pobrać danych użytkownika');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleSaveChanges = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      const response = await fetch(endpoints.updateUser(userId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      console.log(response);
      if (response.ok) {
        setUserData(formData);
        setAlertMessage('Dane zostały zaktualizowane');
        setIsEditing(false);
      } else {
        setAlertMessage('Nie udało się zaktualizować danych');
      }
    } catch (error) {
      console.error('Błąd podczas zapisywania:', error);
      setAlertMessage('Wystąpił błąd podczas zapisywania');
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Błąd podczas wylogowywania:', error);
      setAlertMessage('Wystąpił błąd podczas wylogowywania');
    }
  };

  const handleAvatarUpload = async (imageUri) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const decoded = jwtDecode(token);
      const currentUserId = decoded.id;

      const formData = new FormData();
      formData.append('avatar', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'avatar.jpg',
      });

      const response = await fetch(`${endpoints.users(currentUserId)}/avatar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (response.ok) {
        setAvatarUrl(imageUri);
        setAlertMessage('Avatar został zaktualizowany');
      } else {
        setAlertMessage('Nie udało się zaktualizować avatar');
      }
    } catch (error) {
      console.error('Błąd podczas przesyłania avatara:', error);
      setAlertMessage('Wystąpił błąd podczas przesyłania avatar');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-light" style={{ paddingTop: 0 }}>
      <GoBackArrow title="Profil Użytkownika" />
      {alertMessage && <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />}
      <View className="flex-1">
        <ScrollView className="flex-1">
          <View 
            className="bg-primary p-6 rounded-[30px] shadow-lg mt-4 mx-4" 
          >
            <View className="items-center">
              <Image
                source={{
                  uri: userId ? getAvatarUrl(userId) : null
                }}
                className="w-32 h-32 rounded-full border-4 border-white"
                onError={() => console.log('Error loading avatar')}
              />
              <Text className="text-white text-2xl font-bold mt-4">
                {userData ? `${userData.firstName} ${userData.lastName}` : 'Ładowanie...'}
              </Text>
            </View>
          </View>

          <View className="px-6 py-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold flex-1">Dane użytkownika</Text>
              {!isEditing && (
                <TouchableOpacity
                  onPress={() => setIsEditing(true)}
                  className="bg-primary px-3 py-1 rounded-lg ml-2"
                >
                  <Text className="text-white text-sm">Edytuj</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <View className="bg-white rounded-xl p-4 shadow-md">
              {isEditing ? (
                <>
                  <View className="mb-4">
                    <Text className="text-gray-600 mb-1">Imię</Text>
                    <TextInput
                      className="border border-gray-300 rounded-lg p-2"
                      value={formData.firstName}
                      onChangeText={(text) => setFormData({...formData, firstName: text})}
                    />
                  </View>
                  <View className="mb-4">
                    <Text className="text-gray-600 mb-1">Nazwisko</Text>
                    <TextInput
                      className="border border-gray-300 rounded-lg p-2"
                      value={formData.lastName}
                      onChangeText={(text) => setFormData({...formData, lastName: text})}
                    />
                  </View>
                  <View className="mb-4">
                    <Text className="text-gray-600 mb-1">Płeć</Text>
                    <TextInput
                      className="border border-gray-300 rounded-lg p-2"
                      value={formData.gender}
                      onChangeText={(text) => setFormData({...formData, gender: text})}
                    />
                  </View>
                  <View className="mb-4">
                    <Text className="text-gray-600 mb-1">Kraj</Text>
                    <TextInput
                      className="border border-gray-300 rounded-lg p-2"
                      value={formData.country}
                      onChangeText={(text) => setFormData({...formData, country: text})}
                    />
                  </View>
                  <View className="mb-4">
                    <Text className="text-gray-600 mb-1">Miasto</Text>
                    <TextInput
                      className="border border-gray-300 rounded-lg p-2"
                      value={formData.city}
                      onChangeText={(text) => setFormData({...formData, city: text})}
                    />
                  </View>
                  <View className="flex-row justify-end space-x-4">
                    <TouchableOpacity
                      onPress={() => setIsEditing(false)}
                      className="bg-gray-300 px-4 py-2 rounded-lg"
                    >
                      <Text>Anuluj</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleSaveChanges}
                      className="bg-primary px-4 py-2 rounded-lg"
                    >
                      <Text className="text-white">Zapisz</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <View className="border-b border-gray-200 py-3">
                    <Text className="text-gray-600">Imię</Text>
                    <Text className="text-black font-medium">{userData?.firstName || 'Brak danych'}</Text>
                  </View>
                  <View className="border-b border-gray-200 py-3">
                    <Text className="text-gray-600">Nazwisko</Text>
                    <Text className="text-black font-medium">{userData?.lastName || 'Brak danych'}</Text>
                  </View>
                  <View className="border-b border-gray-200 py-3">
                    <Text className="text-gray-600">Email</Text>
                    <Text className="text-black font-medium">{userData?.email || 'Brak danych'}</Text>
                  </View>
                  <View className="border-b border-gray-200 py-3">
                    <Text className="text-gray-600">Płeć</Text>
                    <Text className="text-black font-medium">{userData?.gender || 'Brak danych'}</Text>
                  </View>
                  <View className="border-b border-gray-200 py-3">
                    <Text className="text-gray-600">Kraj</Text>
                    <Text className="text-black font-medium">{userData?.country || 'Brak danych'}</Text>
                  </View>
                  <View className="py-3">
                    <Text className="text-gray-600">Miasto</Text>
                    <Text className="text-black font-medium">{userData?.city || 'Brak danych'}</Text>
                  </View>
                </>
              )}
            </View>
          </View>

          <View className="px-6 py-4">
            <TouchableOpacity
              onPress={handleLogout}
              className="bg-red-500 py-3 rounded-xl"
            >
              <Text className="text-white text-center font-bold">Wyloguj się</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default UserProfile;

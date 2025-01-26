import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import * as ImagePicker from 'react-native-image-picker';
import Alert from '../utils/Alert';
import GoBackArrow from '../utils/GoBackArrow';
import { getAvatarUrl } from '../utils/GetAvatarUrl';
import { endpoints } from '../../config';
import ProfileEditForm from '../utils/profile/ProfileEditForm';
import ProfileDisplay from '../utils/profile/ProfileDisplay';

const UserProfile = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);
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

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const decoded = jwtDecode(token);
      setUserId(decoded.id);

      const response = await fetch(endpoints.users(decoded.id));
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setFormData(data);
      }
    } catch (error) {
      setAlertMessage('Nie udało się pobrać danych użytkownika');
    }
  };

  const handleAvatarPress = async () => {
    try {
      const result = await ImagePicker.launchImageLibrary({
        mediaType: 'photo',
        maxHeight: 500,
        maxWidth: 500,
      });

      if (result.didCancel || !result.assets?.[0]) return;

      const token = await AsyncStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('Picture', {
        uri: result.assets[0].uri,
        type: result.assets[0].type,
        name: result.assets[0].fileName || 'avatar.jpg',
      });

      const response = await fetch(endpoints.updateProfilePicture(userId), {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (response.ok) {
        setAlertMessage('Zdjęcie profilowe zostało zaktualizowane');
        await fetchUserData();
      } else {
        throw new Error('Nie udało się zaktualizować zdjęcia');
      }
    } catch (error) {
      setAlertMessage(error.message || 'Nie udało się przesłać zdjęcia');
    }
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(endpoints.updateUser(userId), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setUserData(formData);
        setAlertMessage('Dane zostały zaktualizowane');
        setIsEditing(false);
      } else {
        throw new Error('Nie udało się zaktualizować danych');
      }
    } catch (error) {
      setAlertMessage(error.message);
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
      setAlertMessage('Wystąpił błąd podczas wylogowywania');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-light">
      <GoBackArrow title="Profil Użytkownika" />
      {alertMessage && <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />}
      
      <ScrollView className="flex-1">
        <View className="bg-primary p-6 rounded-[30px] shadow-lg mt-4 mx-4">
          <View className="items-center">
            <TouchableOpacity onPress={handleAvatarPress} className="relative">
              <Image
                source={{ uri: userId ? `${getAvatarUrl(userId)}?${Date.now()}` : null }}
                className="w-32 h-32 rounded-full border-4 border-white"
              />
              <View className="absolute bottom-0 right-0 bg-primary p-2 rounded-full">
                <Text className="text-white text-xs">Zmień</Text>
              </View>
            </TouchableOpacity>
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
              <ProfileEditForm 
                formData={formData}
                setFormData={setFormData}
                onSave={handleSaveChanges}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <ProfileDisplay userData={userData} />
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
    </SafeAreaView>
  );
};

export default UserProfile;

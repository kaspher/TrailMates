import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Menu = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [userStats, setUserStats] = useState({
    totalTrails: 0,
    totalDistance: 0,
    favorites: 0
  });

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      const response = await fetch(`http://10.0.2.2:5253/api/users/${userId}`);
      if (!response.ok) {
        throw new Error('Nie udało się pobrać danych użytkownika');
      }
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Błąd podczas pobierania danych użytkownika:', error);
      setAlertMessage('Nie udało się pobrać danych użytkownika');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-light">
      <View className="flex-1 items-center pt-6 px-4 m-4">
        <View className="w-full mb-6 flex-row items-center justify-between">
          <View className="bg-white p-4 w-full rounded-lg shadow-lg">
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => navigation.navigate('UserProfile')}
                className="w-20 h-20"
              >
                <Image
                  source={{
                    uri: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541',
                  }}
                  className="w-full h-full rounded-full"
                />
              </TouchableOpacity>
              <View className="flex-1 ml-4">
                <Text className="text-dark text-lg font-bold">
                  Witaj, {userData ? `${userData.firstName} ${userData.lastName}` : 'Użytkowniku'}
                </Text>
                <Text className="text-dark text-sm mt-2">
                  {userData?.email || 'Ładowanie...'}
                </Text>
              </View>
            </View>

            {/* Statystyki */}
            <View className="flex-row justify-between mt-6 px-2">
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-primary">{userStats.totalTrails}</Text>
                <Text className="text-sm text-gray-600">Tras</Text>
              </View>
              
              <View className="h-12 w-[1px] bg-gray-200" />
              
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-primary">{userStats.totalDistance}</Text>
                <Text className="text-sm text-gray-600">km</Text>
              </View>
              
              <View className="h-12 w-[1px] bg-gray-200" />
              
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-primary">{userStats.favorites}</Text>
                <Text className="text-sm text-gray-600">Ulubionych</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Reszta menu */}
        <Text className="text-2xl font-bold text-center mb-6">MENU</Text>
        <View className="w-full flex-row flex-wrap justify-between items-center gap-4">
          <TouchableOpacity
            className="bg-white rounded-lg w-full h-20 flex justify-center items-center shadow-lg"
            onPress={() => navigation.navigate('Activities')}
          >
            <Text className="text-dark text-center font-bold">Moje aktywności</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-white rounded-lg w-full h-20 flex justify-center items-center shadow-lg"
            onPress={() => alert('Drugi przycisk')}
          >
            <Text className="text-dark text-center font-bold">Osiągnięcia?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-white rounded-lg w-full h-20 flex justify-center items-center shadow-lg"
            onPress={() => alert('Trzeci przycisk')}
          >
            <Text className="text-dark text-center font-bold">cośtam</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-white rounded-lg w-full h-20 flex justify-center items-center shadow-lg"
            onPress={() => alert('Czwarty przycisk')}
          >
            <Text className="text-dark text-center font-bold">nwm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-white rounded-lg w-full h-20 flex justify-center items-center shadow-lg"
            onPress={() => alert('Czwarty przycisk')}
          >
            <Text className="text-dark text-center font-bold">o nas?</Text>
          </TouchableOpacity>
          
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Menu;

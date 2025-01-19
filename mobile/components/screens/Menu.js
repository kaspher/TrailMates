import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image, StatusBar } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAvatarUrl, DEFAULT_AVATAR } from '../utils/GetAvatarUrl';
import MenuIcon from '../../assets/icons/bars-solid.svg';

const Menu = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [userStats, setUserStats] = useState({
    totalTrails: 0,
    totalDistance: 0,
    favorites: 0
  });
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const decoded = jwtDecode(token);
        const userId = decoded.id;
        
        setImageError(false);
        setAvatarUrl(getAvatarUrl(userId));

        const response = await fetch(`http://10.0.2.2:5253/api/users/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        }
      } catch (error) {
        console.error('Błąd podczas pobierania danych użytkownika:', error);
      }
    };

    fetchUserData();
  }, []);

  const menuItems = [
    { id: 1, title: 'Moje aktywności', onPress: () => navigation.navigate('Activities') },
    { id: 2, title: 'Osiągnięcia', onPress: () => alert('Drugi przycisk') },
    { id: 3, title: 'Nagrane trasy', onPress: () => navigation.navigate('RecordedTrails') },
    { id: 4, title: 'Ulubione', onPress: () => alert('Czwarty przycisk') },
    { id: 5, title: 'Statystyki', onPress: () => alert('Piąty przycisk') },
    { id: 6, title: 'Społeczność', onPress: () => alert('Szósty przycisk') },
    { id: 7, title: 'Ustawienia', onPress: () => alert('Siódmy przycisk') },
    { id: 8, title: 'O nas', onPress: () => alert('Ósmy przycisk') },
  ];

  return (
    <SafeAreaView className="flex-1 bg-light" style={{ paddingTop: StatusBar.currentHeight }}>
      <View className="flex-1 pt-2 px-4">
        <View className="w-full mb-6 flex-row items-center justify-between">
          <View className="bg-white p-4 w-full rounded-lg shadow-lg">
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => navigation.navigate('UserProfile')}
                className="w-20 h-20"
              >
                <Image
                  source={{
                    uri: imageError ? DEFAULT_AVATAR : avatarUrl
                  }}
                  className="w-full h-full rounded-full"
                  onError={() => setImageError(true)}
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

        <View className="w-full mb-4">
          <Text className="text-2xl font-bold text-dark">Menu</Text>
        </View>

        <View className="w-full flex-1 px-2">
          <View className="flex-row flex-wrap justify-between">
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                className="bg-white w-[48%] h-24 rounded-xl mb-4 p-4 justify-center items-center shadow-md"
                onPress={item.onPress}
              >
                <MenuIcon width={24} height={24} fill="#386641" className="mb-2" />
                <Text className="text-primary text-center font-medium">
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Menu;

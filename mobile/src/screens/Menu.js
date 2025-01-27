import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image, StatusBar } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAvatarUrl } from '../../src/utils/user/GetAvatarUrl';
import TrophyIcon from '../../src/assets/icons/trophy-solid.svg';
import MapIcon from '../../src/assets/icons/map-location-dot-solid.svg';
import RouteIcon from '../../src/assets/icons/route-solid.svg';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import SettingsIcon from '../../src/assets/icons/gear-solid.svg';
import { endpoints } from '../../config';
import { calculateTotalDistance } from '../../src/utils/trails/CalculateDistance';

const Menu = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userStats, setUserStats] = useState({
    totalTrails: 0,
    totalDistance: 0,
    favorites: 0
  });
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const decoded = jwtDecode(token);
      const currentUserId = decoded.id;
      setUserId(currentUserId);

      const response = await fetch(endpoints.users(currentUserId));
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      }
    } catch (error) {
      console.error('Błąd podczas pobierania danych użytkownika:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
      setRefreshKey(prev => prev + 1);
    }, [])
  );

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const createdTrailsResponse = await fetch(endpoints.userTrails(userId));
        const createdTrails = await createdTrailsResponse.json();

        const completedTrailsResponse = await fetch(endpoints.userCompletions(userId));
        const completedTrails = await completedTrailsResponse.json();

        let totalDistance = 0;

        for (const trail of createdTrails) {
          totalDistance += calculateTotalDistance(trail.coordinates);
        }

        for (const completion of completedTrails) {
          const trailResponse = await fetch(endpoints.trailDetails(completion.trailId));
          const trailData = await trailResponse.json();
          totalDistance += calculateTotalDistance(trailData.coordinates);
        }

        const formattedDistance = (totalDistance).toFixed(2);

        setUserStats(prev => ({
          ...prev,
          totalTrails: createdTrails.length + completedTrails.length,
          totalDistance: formattedDistance
        }));

      } catch (error) {
        console.error('Błąd podczas pobierania statystyk:', error);
      }
    };

    fetchUserStats();
  }, []);

  const menuItems = [
    {
      title: 'Nagrane trasy',
      screen: 'RecordedTrails',
      icon: () => <MapIcon width={24} height={24} fill="#386641" />,
    },
    {
      title: 'Aktywności',
      screen: 'Activities',
      icon: () => <RouteIcon width={24} height={24} fill="#386641" />,
    },
    {
      title: 'Osiągnięcia',
      screen: 'Achievements',
      icon: () => <TrophyIcon width={24} height={24} fill="#386641" />,
    },
    {
      title: 'Ustawienia',
      screen: 'Settings',
      icon: () => <SettingsIcon width={24} height={24} fill="#386641" />,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-light" style={{ paddingTop: StatusBar.currentHeight }}>
      <View className="flex-1 px-4 mt-6">
        <View className="w-auto p-2 mb-6 flex-row items-center justify-between">
          <View className="bg-white p-4 w-full rounded-lg shadow-lg">
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => navigation.navigate('UserProfile')}
                className="w-20 h-20"
              >
                <Image
                  source={{
                    uri: `${getAvatarUrl(userId)}?${refreshKey}`
                  }}
                  className="w-24 h-24 rounded-full border-4 border-white mb-4"
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
                <Text className="text-2xl font-bold text-primary">
                  {userStats.totalTrails}
                </Text>
                <Text className="text-sm text-gray-600">ukończonych tras</Text>
              </View>
              
              <View className="h-12 w-[1px] bg-gray-200" />
              
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-primary">
                  {userStats.totalDistance} km
                </Text>
                <Text className="text-sm text-gray-600">dystans pokonany</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="w-full mb-4">
          <Text className="text-center text-2xl font-bold text-dark">Menu</Text>
        </View>

        <View className="w-full flex-1 px-2">
          <View className="flex-row flex-wrap justify-between">
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.screen}
                onPress={() => navigation.navigate(item.screen)}
                className="bg-white w-[48%] h-24 rounded-xl mb-4 p-4 justify-center items-center shadow-md"
              >
                {item.icon()}
                <Text className="text-primary text-center font-medium mt-2">
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

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import Alert from '../utils/Alert';

const Activities = ({ navigation }) => {
  const [activities, setActivities] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null);

  const fetchActivities = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      const response = await fetch(`http://10.0.2.2:5253/api/trails?UserId=${userId}`);
      if (!response.ok) {
        throw new Error('Nie udało się pobrać aktywności');
      }
      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.error('Błąd podczas pobierania aktywności:', error);
      setAlertMessage('Nie udało się pobrać aktywności');
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleTrailPress = (trail) => {
    navigation.navigate('Trails', { 
      selectedTrailId: trail.id,
      shouldShowDetails: true 
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-light">
      {alertMessage && <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />}
      <View className="p-4">
        <Text className="text-2xl font-bold mb-4">Moje Aktywności</Text>
        <ScrollView className="space-y-4">
          {activities.map((activity) => (
            <TouchableOpacity
              key={activity.id}
              className="bg-white p-4 rounded-xl shadow-md"
              onPress={() => handleTrailPress(activity)}
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-lg font-bold text-primary">{activity.name}</Text>
                <View className={`px-3 py-1 rounded-full ${
                  activity.type === 'Cycling' ? 'bg-red-100' :
                  activity.type === 'Trekking' ? 'bg-green-100' :
                  'bg-blue-100'
                }`}>
                  <Text className={`${
                    activity.type === 'Cycling' ? 'text-red-700' :
                    activity.type === 'Trekking' ? 'text-green-700' :
                    'text-blue-700'
                  }`}>
                    {activity.type === 'Cycling' ? 'Rowerowa' :
                     activity.type === 'Trekking' ? 'Piesza' :
                     'Biegowa'}
                  </Text>
                </View>
              </View>

              <View className="space-y-2">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Data utworzenia:</Text>
                  <Text>{formatDate(activity.createdAt)}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Długość trasy:</Text>
                  <Text>
                    {activity.length != null 
                      ? (activity.length < 1 
                          ? `${Math.round(activity.length * 1000)} m`
                          : `${activity.length.toFixed(2)} km`
                        )
                      : '0 km'
                    }
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Activities; 
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import Alert from '../utils/Alert';
import GoBackArrow from '../utils/GoBackArrow';
import ShareIcon from '../../assets/icons/share-from-square-solid.svg';

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

  const handleTrailPress = (trail) => {
    navigation.navigate('Trails', { 
      selectedTrailId: trail.id,
      shouldShowDetails: true 
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-light" style={{ paddingTop: StatusBar.currentHeight }}>
      <GoBackArrow title="Moje Aktywności" />
      {alertMessage && <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />}
      <View className="flex-1 pt-[56px]">
          <ScrollView className="space-y-4">
            {activities.map((activity) => (
              <TouchableOpacity
                key={activity.id}
                className="bg-white p-4 rounded-xl shadow-md"
                onPress={() => handleTrailPress(activity)}
              >
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-lg font-bold text-primary">{activity.name}</Text>
                  <View className="flex-row items-center">
                    {activity.visibility === 'Private' && (
                      <TouchableOpacity
                        onPress={() => setAlertMessage('Funkcja publikowania będzie dostępna wkrótce')}
                        className="bg-primary/10 p-2 rounded-full mr-2"
                      >
                        <ShareIcon width={20} height={20} fill="#386641" />
                      </TouchableOpacity>
                    )}
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
                </View>

                <View className="space-y-2">
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Status:</Text>
                    <Text className={activity.visibility === 'Private' ? 'text-gray-600' : 'text-primary'}>
                      {activity.visibility === 'Private' ? 'Prywatna' : 'Publiczna'}
                    </Text>
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
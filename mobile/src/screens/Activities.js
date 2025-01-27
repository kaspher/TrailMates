import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import Alert from '../../src/utils/Alert';
import GoBackArrow from '../../src/utils/GoBackArrow';
import { calculateTotalDistance, formatDistance } from '../../src/utils/trails/CalculateDistance';
import { endpoints } from '../../config';

const Activities = ({ navigation }) => {
  const [activities, setActivities] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null);

  const fetchActivities = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      const createdTrailsResponse = await fetch(endpoints.userTrails(userId));
      if (!createdTrailsResponse.ok) {
        throw new Error('Nie udało się pobrać utworzonych tras');
      }
      const createdTrails = await createdTrailsResponse.json();

      const completionsResponse = await fetch(endpoints.userCompletions(userId));
      if (!completionsResponse.ok) {
        throw new Error('Nie udało się pobrać ukończonych tras');
      }
      const completions = await completionsResponse.json();

      const completedTrailsPromises = completions.map(async (completion) => {
        const trailResponse = await fetch(endpoints.trailDetails(completion.trailId));
        if (!trailResponse.ok) {
          throw new Error(`Nie udało się pobrać szczegółów trasy ${completion.trailId}`);
        }
        const trailData = await trailResponse.json();
        return trailData;
      });

      const completedTrails = await Promise.all(completedTrailsPromises);

      const allActivities = [
        ...createdTrails.map(trail => ({
          ...trail
        })),
        ...completedTrails
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      console.log('allActivities:', allActivities);
      setActivities(allActivities);
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
    <View className="flex-1 bg-light">
      <SafeAreaView edges={['right', 'left', 'bottom']} className="flex-1">
        <GoBackArrow title="Moje Aktywności" />
        {alertMessage && <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />}
        <View className="flex-1">
          <ScrollView className="space-y-4">
            {activities.map((activity, index) => (
              <TouchableOpacity
                key={index + 1}
                className="bg-white p-4 rounded-xl shadow-md"
                onPress={() => handleTrailPress(activity)}
              >
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-lg font-bold text-primary">{activity.name}</Text>
                  <View className="flex-row items-center space-x-2">
                    {activity.visibility === 'Private' && (
                      <View className="bg-red-100 px-3 py-1 rounded-full">
                        <Text className="text-red-700 text-sm">
                          Prywatna
                        </Text>
                      </View>
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
                         activity.type === 'Running' ? 'Biegowa' : ''}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="space-y-2">
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Długość:</Text>
                    <Text>
                      {formatDistance(calculateTotalDistance(activity.coordinates))}
                    </Text>
                  </View>
                  {activity.type === 'completed' && (
                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">Czas ukończenia:</Text>
                      <Text>{activity.completionTime}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Activities; 
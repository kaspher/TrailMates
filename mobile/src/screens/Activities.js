import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import Alert from '../../src/utils/Alert';
import GoBackArrow from '../../src/utils/GoBackArrow';
import { calculateTotalDistance, formatDistance } from '../../src/utils/trails/CalculateDistance';
import { endpoints } from '../../config';

const ActivityCard = ({ activity, onPress }) => (
  <TouchableOpacity
    className="bg-white mx-4 mb-4 rounded-2xl shadow-md overflow-hidden border border-gray-100"
    onPress={onPress}
  >
    <View className="p-4">
      <View className="flex-row justify-between items-start mb-3">
        <Text className="text-lg font-bold text-gray-800 flex-1 mr-2">{activity.name}</Text>
        <View className="flex-row items-center space-x-2">
          {activity.visibility === 'Private' && (
            <View className="bg-red-50 px-3 py-1 rounded-full">
              <Text className="text-red-600 text-xs font-medium">
                Prywatna
              </Text>
            </View>
          )}
          <View className={`px-3 py-1 rounded-full ${
            activity.type === 'Cycling' ? 'bg-orange-50' :
            activity.type === 'Trekking' ? 'bg-emerald-50' :
            'bg-sky-50'
          }`}>
            <Text className={`text-xs font-medium ${
              activity.type === 'Cycling' ? 'text-orange-600' :
              activity.type === 'Trekking' ? 'text-emerald-600' :
              'text-sky-600'
            }`}>
              {activity.type === 'Cycling' ? 'Rowerowa' :
               activity.type === 'Trekking' ? 'Piesza' :
               activity.type === 'Running' ? 'Biegowa' : ''}
            </Text>
          </View>
        </View>
      </View>

      <View className="space-y-2 mt-2">
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-500 text-sm">Długość trasy</Text>
          <Text className="text-gray-700 font-medium">
            {formatDistance(calculateTotalDistance(activity.coordinates))}
          </Text>
        </View>
        {activity.type === 'completed' && (
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-500 text-sm">Czas ukończenia</Text>
            <Text className="text-gray-700 font-medium">{activity.completionTime}</Text>
          </View>
        )}
      </View>
    </View>
  </TouchableOpacity>
);

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
    <View className="flex-1 bg-gray-50">
      <SafeAreaView edges={['right', 'left', 'bottom']} className="flex-1">
        <GoBackArrow title="Moje Aktywności" />
        {alertMessage && <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />}
        
        <ScrollView 
          className="flex-1 pt-4"
          showsVerticalScrollIndicator={false}
        >
          {activities.map((activity, index) => (
            <ActivityCard
              key={index}
              activity={activity}
              onPress={() => handleTrailPress(activity)}
            />
          ))}
          {activities.length === 0 && (
            <View className="flex-1 justify-center items-center p-8">
              <Text className="text-gray-500 text-center">
                Nie masz jeszcze żadnych aktywności
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default Activities; 
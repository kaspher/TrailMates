import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import Alert from '../utils/Alert';
import GoBackArrow from '../utils/GoBackArrow';
import { calculateTotalDistance, formatDistance } from '../utils/trails/CalculateDistance';
import ShareIcon from '../../src/assets/icons/share-from-square-solid.svg';
import TrailShare from '../components/trails/TrailShare';
import { endpoints } from '../../config';

const TRAIL_TYPES = {
  'Pieszy': 'Trekking',
  'Rowerowy': 'Cycling',
  'Biegowy': 'Running'
};

const TrailCard = ({ trail, onPress, onSharePress }) => (
  <TouchableOpacity
    className="bg-white mx-4 mb-4 rounded-2xl shadow-md overflow-hidden border border-gray-100"
    onPress={onPress}
  >
    <View className="p-4">
      <View className="flex-row justify-between items-start mb-3">
        <Text className="text-lg font-bold text-gray-800 flex-1 mr-2">{trail.name}</Text>
        <View className="flex-row items-center space-x-2">
          {trail.visibility === 'Private' && (
            <TouchableOpacity
              onPress={() => onSharePress(trail)}
              className="bg-emerald-50 p-2 rounded-full"
            >
              <ShareIcon width={18} height={18} fill="#059669" />
            </TouchableOpacity>
          )}
          <View className={`px-3 py-1 rounded-full ${
            trail.type === 'Cycling' ? 'bg-orange-50' :
            trail.type === 'Trekking' ? 'bg-emerald-50' :
            'bg-sky-50'
          }`}>
            <Text className={`text-xs font-medium ${
              trail.type === 'Cycling' ? 'text-orange-600' :
              trail.type === 'Trekking' ? 'text-emerald-600' :
              'text-sky-600'
            }`}>
              {trail.type === 'Cycling' ? 'Rowerowa' :
               trail.type === 'Trekking' ? 'Piesza' :
               'Biegowa'}
            </Text>
          </View>
        </View>
      </View>

      {/* Szczegóły trasy */}
      <View className="space-y-2 mt-2">
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-500 text-sm">Status</Text>
          <View className={`px-3 py-1 rounded-full ${
            trail.visibility === 'Private' ? 'bg-gray-50' : 'bg-emerald-50'
          }`}>
            <Text className={`text-xs font-medium ${
              trail.visibility === 'Private' ? 'text-gray-600' : 'text-emerald-600'
            }`}>
              {trail.visibility === 'Private' ? 'Prywatna' : 'Publiczna'}
            </Text>
          </View>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-500 text-sm">Długość trasy</Text>
          <Text className="text-gray-700 font-medium">
            {formatDistance(calculateTotalDistance(trail.coordinates))}
          </Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const RecordedTrails = ({ navigation }) => {
  const [trails, setTrails] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null);
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [selectedTrail, setSelectedTrail] = useState(null);
  const [trailName, setTrailName] = useState('');
  const [trailType, setTrailType] = useState('');

  const fetchRecordedTrails = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      const response = await fetch(`${endpoints.trails}?UserId=${userId}&Visibility=Private`);
      if (!response.ok) {
        throw new Error('Nie udało się pobrać tras');
      }
      const data = await response.json();
      setTrails(data);
    } catch (error) {
      console.error('Błąd podczas pobierania tras:', error);
      setAlertMessage('Nie udało się pobrać tras');
    }
  };

  useEffect(() => {
    fetchRecordedTrails();
  }, []);

  const handleTrailPress = (trail) => {
    navigation.navigate('Trails', { 
      selectedTrailId: trail.id,
      shouldShowDetails: true,
      shouldFitBounds: true
    });
  };

  const handleShare = async (trailId) => {
    try {
      const response = await fetch(`${endpoints.trailDetails(trailId)}/visibility`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visibility: 'Public',
          name: trailName,
          type: TRAIL_TYPES[trailType]
        })
      });

      if (!response.ok) {
        throw new Error('Nie udało się udostępnić trasy');
      }

      setAlertMessage('Trasa została udostępniona!');
      setIsShareModalVisible(false);
      fetchRecordedTrails();
    } catch (error) {
      console.error('Błąd podczas udostępniania trasy:', error);
      setAlertMessage('Nie udało się udostępnić trasy');
    }
  };

  const handleSharePress = (trail) => {
    setSelectedTrail(trail);
    setTrailName(trail.name);
    setTrailType(
      trail.type === 'Cycling' ? 'Rowerowy' :
      trail.type === 'Trekking' ? 'Pieszy' :
      'Biegowy'
    );
    setIsShareModalVisible(true);
  };

  return (
    <View className="flex-1 bg-light">
      <SafeAreaView edges={['right', 'left', 'bottom']} className="flex-1">
        <GoBackArrow title="Nagrane Trasy" />
        {alertMessage && <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />}
        
        <ScrollView 
          className="flex-1 pt-4"
          showsVerticalScrollIndicator={false}
        >
          {trails.map((trail) => (
            <TrailCard
              key={trail.id}
              trail={trail}
              onPress={() => handleTrailPress(trail)}
              onSharePress={handleSharePress}
            />
          ))}
          {trails.length === 0 && (
            <View className="flex-1 justify-center items-center p-8">
              <Text className="text-gray-500 text-center">
                Nie masz jeszcze żadnych nagranych tras
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
      <TrailShare 
        isVisible={isShareModalVisible}
        onClose={() => setIsShareModalVisible(false)}
        onShare={handleShare}
        trail={selectedTrail}
        trailName={trailName}
        setTrailName={setTrailName}
        trailType={trailType}
        setTrailType={setTrailType}
        setAlertMessage={setAlertMessage}
      />
    </View>
  );
};

export default RecordedTrails; 
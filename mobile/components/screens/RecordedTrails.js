import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import Alert from '../utils/Alert';
import GoBackArrow from '../utils/GoBackArrow';
import { calculateTotalDistance, formatDistance } from '../trailUtils/CalculateDistance';
import ShareIcon from '../../assets/icons/share-from-square-solid.svg';
import TrailShare from '../trailUtils/TrailShare';

const TRAIL_TYPES = {
  'Pieszy': 'Trekking',
  'Rowerowy': 'Cycling',
  'Biegowy': 'Running'
};

const RecordedTrails = ({ navigation }) => {
  const [trails, setTrails] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null);
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [selectedTrail, setSelectedTrail] = useState(null);
  const [trailName, setTrailName] = useState('');
  const [trailType, setTrailType] = useState('');

  const fetchTrails = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      const response = await fetch(`http://10.0.2.2:5253/api/trails?UserId=${userId}`);
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
    fetchTrails();
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

  const handleShare = async (trailId) => {
    try {
      const response = await fetch(`http://10.0.2.2:5253/api/trails/${trailId}/visibility`, {
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
      fetchTrails();
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
        <View className="flex-1">
          <ScrollView className="space-y-4">
            {trails.map((trail) => (
              <TouchableOpacity
                key={trail.id}
                className="bg-white p-4 rounded-xl shadow-md"
                onPress={() => handleTrailPress(trail)}
              >
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-lg font-bold text-primary">{trail.name}</Text>
                  <View className="flex-row items-center">
                    {trail.visibility === 'Private' && (
                      <TouchableOpacity
                        onPress={() => handleSharePress(trail)}
                        className="bg-primary/10 p-2 rounded-full mr-2"
                      >
                        <ShareIcon width={20} height={20} fill="#386641" />
                      </TouchableOpacity>
                    )}
                    <View className={`px-3 py-1 rounded-full ${
                      trail.type === 'Cycling' ? 'bg-red-100' :
                      trail.type === 'Trekking' ? 'bg-green-100' :
                      'bg-blue-100'
                    }`}>
                      <Text className={`${
                        trail.type === 'Cycling' ? 'text-red-700' :
                        trail.type === 'Trekking' ? 'text-green-700' :
                        'text-blue-700'
                      }`}>
                        {trail.type === 'Cycling' ? 'Rowerowa' :
                         trail.type === 'Trekking' ? 'Piesza' :
                         'Biegowa'}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="space-y-2">
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Status:</Text>
                    <Text className={trail.visibility === 'Private' ? 'text-gray-600' : 'text-primary'}>
                      {trail.visibility === 'Private' ? 'Prywatna' : 'Publiczna'}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Data utworzenia:</Text>
                    <Text>{formatDate(trail.createdAt)}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Długość trasy:</Text>
                    <Text>{formatDistance(calculateTotalDistance(trail.coordinates))}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
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
      />
    </View>
  );
};

export default RecordedTrails; 
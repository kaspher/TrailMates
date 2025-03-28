import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import LocationPinIcon from '../../../src/assets/icons/location-pin-solid.svg';
import FlagIcon from '../../../src/assets/icons/flag-checkered-solid.svg';
import ShareIcon from '../../../src/assets/icons/share-from-square-solid.svg';
import { calculateDistance } from '../../utils/trails/CalculateDistance';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue,
  runOnJS
} from 'react-native-reanimated';
import { endpoints } from '../../../config';
import TrailShare from './TrailShare';

const TrailDetails = ({ 
  selectedTrail, 
  startAddress,
  endAddress,
  onClose,
  canJoinTrail,
  formatDistance,
  calculateTotalDistance,
  userLocation,
  onTrailShare,
  setAlertMessage,
  setActiveParticipationTrail
}) => {
  const translateY = useSharedValue(1000);
  const [owner, setOwner] = useState(null);
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [trailName, setTrailName] = useState(selectedTrail?.name || '');
  const [trailType, setTrailType] = useState(
    selectedTrail?.type === 'Cycling' ? 'Rowerowy' :
    selectedTrail?.type === 'Trekking' ? 'Pieszy' :
    'Biegowy'
  );

  useEffect(() => {
    translateY.value = withSpring(0, {
      damping: 20,
      stiffness: 100,
      mass: 1,
      velocity: 0.5
    });

    const fetchOwner = async () => {
      if (selectedTrail?.ownerId) {
        try {
          const response = await fetch(endpoints.users(selectedTrail.ownerId));
          const data = await response.json();
          setOwner(data);
        } catch (error) {
          console.error('Error fetching trail owner:', error);
        }
      }
    };

    fetchOwner();
  }, [selectedTrail]);

  const handleClose = () => {
    translateY.value = withSpring(1000, {
      damping: 20,
      stiffness: 100,
      mass: 1,
      velocity: 0.5
    }, (finished) => {
      if (finished) {
        runOnJS(onClose)();
      }
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }]
  }));

  const getDistanceFromStart = () => {
    if (!userLocation || !selectedTrail.coordinates) return null;
    
    const startPoint = selectedTrail.coordinates.sort((a, b) => a.order - b.order)[0];
    return calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      startPoint.latitude,
      startPoint.longitude
    );
  };

  const distanceFromStart = getDistanceFromStart();

  const handleSharePress = () => {
    setTrailName(selectedTrail.name);
    setTrailType(
      selectedTrail.type === 'Cycling' ? 'Rowerowy' :
      selectedTrail.type === 'Trekking' ? 'Pieszy' :
      'Biegowy'
    );
    setIsShareModalVisible(true);
  };

  const handleJoinTrail = () => {
    const startPoint = selectedTrail.coordinates.sort((a, b) => a.order - b.order)[0];
    if (canJoinTrail(startPoint)) {
      setActiveParticipationTrail(selectedTrail);
      handleClose();
    } else {
      setAlertMessage('Jesteś za daleko by dołączyć');
    }
  };

  return (
    <>
      <Animated.View 
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg z-40"
        style={[animatedStyle, { maxHeight: '80%' }]}
      >
        <View className="p-4 border-b border-gray-200">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-xl font-bold">{selectedTrail.name}</Text>
              {owner && (
                <Text className="text-gray-600 text-sm">
                  Utworzona przez: {owner.firstName} {owner.lastName}
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={handleClose}
              className="p-2"
            >
              <Text className="text-gray-500 text-xl">✕</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1 p-4">
          <View className="flex-row items-center justify-between py-4">
            <View className="flex-row items-center">
              <Text className="font-medium">Typ trasy: </Text>
              <View className={`px-3 py-1 rounded-full ${
                selectedTrail.type === 'Cycling' ? 'bg-red-100' :
                selectedTrail.type === 'Trekking' ? 'bg-green-100' :
                'bg-blue-100'
              }`}>
                <Text className={`${
                  selectedTrail.type === 'Cycling' ? 'text-red-700' :
                  selectedTrail.type === 'Trekking' ? 'text-green-700' :
                  'text-blue-700'
                }`}>
                  {selectedTrail.type === 'Cycling' ? 'Rowerowa' :
                   selectedTrail.type === 'Trekking' ? 'Piesza' :
                   'Biegowa'}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <Text className="font-medium mr-2">Długość:</Text>
              <Text>{formatDistance(calculateTotalDistance(selectedTrail.coordinates))}</Text>
            </View>
          </View>

          <View className="h-[1px] bg-gray-200" />

          <View className="space-y-4 py-4">
            {startAddress && (
              <View className="flex-row items-center">
                <LocationPinIcon width={20} height={20} fill="#386641" />
                <View className="ml-2">
                  <Text className="font-medium">Start:</Text>
                  <Text className="text-gray-600">
                    {startAddress ? `${startAddress.street}, ${startAddress.city}` : 'Ładowanie...'}
                  </Text>
                </View>
              </View>
            )}

            {endAddress && (
              <View className="flex-row items-center mt-2">
                <FlagIcon width={20} height={20} fill="#386641" />
                <View className="ml-2">
                  <Text className="font-medium">Meta:</Text>
                  <Text className="text-gray-600">
                    {endAddress ? `${endAddress.street}, ${endAddress.city}` : 'Ładowanie...'}
                  </Text>
                </View>
              </View>
            )}
          </View>

          <View className="h-[1px] bg-gray-200" />

          <View className="flex-row items-center justify-between pt-4">
            <View>
              <Text className="text-sm text-gray-500">Odległość od startu</Text>
              <Text className="text-sm text-gray-600">
                {distanceFromStart ? formatDistance(distanceFromStart) : 'Obliczanie...'}
              </Text>
            </View>
            {selectedTrail.visibility === 'Private' ? (
              <TouchableOpacity
                onPress={handleSharePress}
                className="bg-primary/10 px-4 py-2 rounded-full"
              >
                <View className="flex-row items-center">
                  <ShareIcon width={16} height={16} fill="#386641" className="mr-1" />
                  <Text className="text-primary font-medium ml-1">
                    Udostępnij
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleJoinTrail}
                className={`px-4 py-2 rounded-full ${
                  canJoinTrail(selectedTrail.coordinates.sort((a, b) => a.order - b.order)[0])
                    ? 'bg-primary'
                    : 'bg-gray-200'
                }`}
              >
                <Text className={`font-medium ${
                  canJoinTrail(selectedTrail.coordinates.sort((a, b) => a.order - b.order)[0])
                    ? 'text-white'
                    : 'text-gray-500'
                }`}>
                  Dołącz
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </Animated.View>

      <TrailShare 
        isVisible={isShareModalVisible}
        onClose={() => setIsShareModalVisible(false)}
        onShare={onTrailShare}
        trail={selectedTrail}
        trailName={trailName}
        setTrailName={setTrailName}
        trailType={trailType}
        setTrailType={setTrailType}
        setAlertMessage={setAlertMessage}
      />
    </>
  );
};

export default TrailDetails; 
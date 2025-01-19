import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import LocationPinIcon from '../../assets/icons/location-pin-solid.svg';
import FlagIcon from '../../assets/icons/flag-checkered-solid.svg';
import ShareIcon from '../../assets/icons/share-from-square-solid.svg';
import { calculateDistance } from './CalculateDistance';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue,
  runOnJS
} from 'react-native-reanimated';

const TrailDetails = ({ 
  selectedTrail, 
  startAddress,
  endAddress,
  onClose,
  handleJoinTrail,
  onPublish,
  canJoinTrail,
  formatDistance,
  calculateTotalDistance,
  userLocation
}) => {
  const translateY = useSharedValue(1000);

  useEffect(() => {
    translateY.value = withSpring(0, {
      damping: 20,
      stiffness: 100,
      mass: 1,
      velocity: 0.5
    });
  }, []);

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

  return (
    <Animated.View 
      className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg z-40"
      style={[animatedStyle, { maxHeight: '80%' }]}
    >
      <View className="p-4 border-b border-gray-200">
        <View className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-2" />
        <View className="flex-row justify-between items-center">
          <Text className="text-xl font-bold">{selectedTrail.name}</Text>
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
                <Text className="text-gray-700">
                  {`${startAddress.street}, ${startAddress.city}`}
                </Text>
              </View>
            </View>
          )}

          {endAddress && (
            <View className="flex-row items-center mt-2">
              <FlagIcon width={20} height={20} fill="#386641" />
              <View className="ml-2">
                <Text className="font-medium">Meta:</Text>
                <Text className="text-gray-700">
                  {`${endAddress.street}, ${endAddress.city}`}
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
              onPress={onPublish}
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
  );
};

export default TrailDetails; 
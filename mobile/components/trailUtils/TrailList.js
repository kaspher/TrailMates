import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { calculateDistance, calculateTotalDistance, formatDistance, formatDistanceWithUnit } from './CalculateDistance';

const TrailList = ({ 
  nearbyListStyle, 
  hideNearbyList, 
  location, 
  trails, 
  fetchTrailDetails 
}) => {
  return (
    <Animated.View 
      className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg z-40"
      style={[nearbyListStyle, { maxHeight: '80%' }]}
    >
      <View className="p-4 border-b border-gray-200">
        <View className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-2" />
        <View className="flex-row justify-between items-center">
          <Text className="text-xl font-bold">Trasy w pobliżu</Text>
          <TouchableOpacity
            onPress={hideNearbyList}
            className="p-2"
          >
            <Text className="text-gray-500 text-xl">✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 p-4">
        {location && trails
          .filter(trail => trail.visibility === 'Public')
          .map(trail => {
            const startPoint = trail.coordinates
              .sort((a, b) => a.order - b.order)[0];
            
            const distance = calculateDistance(
              location.latitude,
              location.longitude,
              startPoint.latitude,
              startPoint.longitude
            );

            return { ...trail, distance };
          })
          .filter(trail => trail.distance <= 20)
          .sort((a, b) => a.distance - b.distance)
          .map(trail => (
            <TouchableOpacity
              key={trail.id}
              className="bg-white p-4 rounded-xl shadow-sm mb-3 border border-gray-100"
              onPress={() => {
                fetchTrailDetails(trail.id);
                hideNearbyList();
              }}
            >
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-lg font-bold flex-1 mr-2">{trail.name}</Text>
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

              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600">
                  Odległość od Ciebie: {formatDistanceWithUnit(trail.distance)}
                </Text>
                <Text className="text-gray-600">
                  Długość: {formatDistance(calculateTotalDistance(trail.coordinates))}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </Animated.View>
  );
};

export default TrailList; 
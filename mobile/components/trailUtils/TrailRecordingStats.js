import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { calculateTotalDistance, formatDistance } from './CalculateDistance';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue,
  runOnJS
} from 'react-native-reanimated';

const TrailRecordingStats = ({ coordinates, startTime }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const translateY = useSharedValue(1000);

  useEffect(() => {
    translateY.value = withSpring(0, {
      damping: 20,
      stiffness: 100,
      mass: 1,
      velocity: 0.5
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const elapsed = Math.floor((now - startTime) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }]
  }));

  return (
    <Animated.View 
      className="absolute bottom-16 left-0 right-0 bg-white rounded-t-3xl shadow-lg z-10"
      style={[animatedStyle, { maxHeight: '80%' }]}
    >
      <View className="p-4 border-b border-gray-200">
        <View className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-2" />
      </View>

      <View className="flex-1 p-4">
        <View className="space-y-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-600">Czas nagrywania</Text>
            <Text className="text-lg font-bold text-primary">{formatTime(elapsedTime)}</Text>
          </View>

          <View className="h-[1px] bg-gray-200" />

          <View className="flex-row justify-between items-center">
            <Text className="text-gray-600">Przebyty dystans</Text>
            <Text className="text-lg font-bold text-primary">
              {formatDistance(calculateTotalDistance(coordinates || []))}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

export default TrailRecordingStats; 
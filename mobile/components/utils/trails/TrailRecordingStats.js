import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { calculateTotalDistance } from './CalculateDistance';

const TrailRecordingStats = ({ coordinates, startTime }) => {
  const [elapsedTime, setElapsedTime] = useState('00:00:00');
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (startTime) {
        const now = new Date();
        const diff = now - startTime;
        const hours = Math.floor(diff / 3600000).toString().padStart(2, '0');
        const minutes = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
        const seconds = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        setElapsedTime(`${hours}:${minutes}:${seconds}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  useEffect(() => {
    if (coordinates && coordinates.length > 0) {
      const totalDistance = calculateTotalDistance(coordinates);
      setDistance(totalDistance);
    }
  }, [coordinates]);

  return (
    <View className="bg-white rounded-xl p-4 shadow-lg">
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-gray-500 text-sm">Czas</Text>
          <Text className="text-xl font-bold">{elapsedTime}</Text>
        </View>
        <View>
          <Text className="text-gray-500 text-sm">Dystans</Text>
          <Text className="text-xl font-bold">
            {distance < 1 
              ? `${Math.round(distance * 1000)} m`
              : `${distance.toFixed(2)} km`
            }
          </Text>
        </View>
        <View>
          <Text className="text-gray-500 text-sm">Średnia prędkość</Text>
          <Text className="text-xl font-bold">
            {startTime && distance > 0
              ? `${((distance * 3600) / ((new Date() - startTime) / 1000)).toFixed(1)} km/h`
              : '0.0 km/h'
            }
          </Text>
        </View>
      </View>
    </View>
  );
};

export default TrailRecordingStats; 
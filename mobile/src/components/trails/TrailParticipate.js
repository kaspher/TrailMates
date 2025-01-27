import React, { useEffect, useState } from 'react';
import { View, Text, StatusBar } from 'react-native';
import { calculateDistance } from '../../utils/trails/CalculateDistance';
import TrailRecordingStats from './TrailRecordingStats';
import TrailCompletion from './TrailCompletion';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import { endpoints } from '../../../config';

const TrailParticipate = ({ 
  selectedTrail,
  userLocation,
  setAlertMessage,
  onClose,
  setActiveParticipationTrail
}) => {
  const [isParticipating, setIsParticipating] = useState(false);
  const [currentPointIndex, setCurrentPointIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const [currentCoordinates, setCurrentCoordinates] = useState([]);

  useEffect(() => {
    if (userLocation && selectedTrail) {
      startParticipation();
    }
  }, []);

  useEffect(() => {
    if (isParticipating && userLocation) {
      setCurrentCoordinates(prev => [...prev, {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        order: prev.length + 1
      }]);
      
      validatePosition();
    }
  }, [userLocation]);

  const startParticipation = () => {
    setIsParticipating(true);
    setStartTime(Date.now());
    setCurrentCoordinates([{
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      order: 1
    }]);
  };

  const validatePosition = () => {
    if (!selectedTrail.coordinates || currentPointIndex >= selectedTrail.coordinates.length) {
      return;
    }

    const sortedTrailCoords = selectedTrail.coordinates.sort((a, b) => a.order - b.order);
    const targetPoint = sortedTrailCoords[currentPointIndex];
    const lastPoint = sortedTrailCoords[sortedTrailCoords.length - 1];
    
    const distanceToTarget = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      targetPoint.latitude,
      targetPoint.longitude
    );

    const distanceToEnd = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      lastPoint.latitude,
      lastPoint.longitude
    );

    const distanceToTargetMeters = distanceToTarget * 1000;
    const distanceToEndMeters = distanceToEnd * 1000;

    setCurrentCoordinates(prev => [...prev, {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      order: prev.length + 1
    }]);

    if (distanceToEndMeters <= 20) {
      setIsParticipating(false);
      setShowCompletion(true);
      return;
    }

    if (distanceToTargetMeters <= 20) {
      if (currentPointIndex < sortedTrailCoords.length - 1) {
        setCurrentPointIndex(prev => prev + 1);
      }
    }
  };

  const formatTime = (startTime) => {
    const totalMilliseconds = Date.now() - startTime;
    const hours = Math.floor(totalMilliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((totalMilliseconds % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleCompletion = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const decoded = jwtDecode(token);
      const userId = decoded.id;
      const completionTime = formatTime(startTime);

      const response = await fetch(endpoints.trailCompletion(selectedTrail.id), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          time: completionTime
        })
      });

      if (response.ok) {
        setShowCompletion(false);
        setActiveParticipationTrail(null);
        onClose();
      } else {
        console.error('Błąd podczas zapisywania ukończonej trasy:', response.statusText);
        setAlertMessage('Wystąpił błąd podczas zapisywania ukończonej trasy');
      }
    } catch (error) {
      console.error('Błąd podczas zapisywania ukończonej trasy:', error);
      setAlertMessage('Wystąpił błąd podczas zapisywania ukończonej trasy');
    }
  };

  return (
    <>
      {isParticipating && (
        <View 
          style={{ 
            position: 'absolute', 
            top: StatusBar.currentHeight + 20,
            left: 20,
            right: 20,
            zIndex: 2
          }}
        >
          <View className="bg-white rounded-xl p-4 shadow-lg">
            <Text className="text-center text-primary font-bold mb-2">
              Uczestniczysz w trasie {selectedTrail.name}
            </Text>
            <TrailRecordingStats 
              coordinates={currentCoordinates}
              startTime={startTime}
            />
          </View>
        </View>
      )}

      <TrailCompletion 
        isVisible={showCompletion}
        trailName={selectedTrail?.name}
        onClose={handleCompletion}
      />
    </>
  );
};

export default TrailParticipate; 
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { View, StatusBar, Platform } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import * as TaskManager from 'expo-task-manager';
import { calculateTotalDistance, formatDistance } from './CalculateDistance';
import TrailRecordingStats from './TrailRecordingStats';
import TrailSave from './TrailSave';
import { endpoints } from '../../config';

const TRAIL_TYPES = {
  'Pieszy': 'Trekking',
  'Rowerowy': 'Cycling',
  'Biegowy': 'Running'
};

const BACKGROUND_TRACKING_TASK = 'background-tracking';

TaskManager.defineTask(BACKGROUND_TRACKING_TASK, async ({ data, error }) => {
  if (error) {
    console.error('Błąd zadania w tle:', error);
    return;
  }

  if (data) {
    const { locations } = data;
    if (locations && locations.length > 0) {
      const location = locations[locations.length - 1];
      global.setCoordinates(prev => {
        const lastCoord = prev[prev.length - 1];
        if (lastCoord && 
            lastCoord.latitude === location.coords.latitude && 
            lastCoord.longitude === location.coords.longitude) {
          return prev;
        }
        return [...prev, {
          order: prev.length + 1,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        }];
      });
    }
  }
});

const TrailRecording = forwardRef(({ 
  isTracking, 
  setIsTracking, 
  location, 
  setAlertMessage,
  fetchTrails,
  coordinates,
  setCoordinates
}, ref) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [trailName, setTrailName] = useState('');
  const [trailType, setTrailType] = useState('');
  const [recordingStartTime, setRecordingStartTime] = useState(null);
  const watchId = useRef(null);

  useEffect(() => {
    if (isTracking) {
      const startLocationUpdates = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setAlertMessage('Brak uprawnień do lokalizacji');
          return;
        }

        watchId.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 5,
            timeInterval: 3000,
          },
          (location) => {
            const { latitude, longitude } = location.coords;
            setCoordinates(prev => {
              const lastCoord = prev[prev.length - 1];
              if (lastCoord && 
                  lastCoord.latitude === latitude && 
                  lastCoord.longitude === longitude) {
                return prev;
              }
              
              const newCoord = {
                order: prev.length + 1,
                latitude,
                longitude
              };
              
              console.log('Nowy punkt trasy:', {
                order: newCoord.order,
                latitude: newCoord.latitude.toFixed(6),
                longitude: newCoord.longitude.toFixed(6),
                timestamp: new Date().toISOString()
              });
              
              return [...prev, newCoord];
            });
          }
        );
      };

      startLocationUpdates();
    }

    return () => {
      if (watchId.current) {
        watchId.current.remove();
      }
    };
  }, [isTracking]);

  const formatTime = (startTime) => {
    const elapsed = Date.now() - startTime;
    const seconds = Math.floor((elapsed / 1000) % 60);
    const minutes = Math.floor((elapsed / (1000 * 60)) % 60);
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const startTracking = async () => {
    if (location) {
      const { status } = await Location.requestBackgroundPermissionsAsync();
      if (status !== 'granted') {
        setAlertMessage('Brak uprawnień do lokalizacji w tle');
        return;
      }

      try {
        setCoordinates([]);

        await Location.startLocationUpdatesAsync(BACKGROUND_TRACKING_TASK, {
          accuracy: Location.Accuracy.High,
          distanceInterval: 5,
          timeInterval: 3000,
          showsBackgroundLocationIndicator: true,
          foregroundService: {
            notificationTitle: "Nagrywanie trasy",
            notificationBody: "Trasa jest nagrywana w tle",
            notificationColor: "#386641",
          },
          pausesUpdatesAutomatically: false,
          activityType: Location.ActivityType.Fitness,
          deferredUpdatesInterval: 3000,
          deferredUpdatesDistance: 5,
        });

        global.setCoordinates = setCoordinates;

        setIsTracking(true);
        setRecordingStartTime(new Date().getTime());
        setCoordinates([{
          order: 1,
          latitude: location.latitude,
          longitude: location.longitude
        }]);
      } catch (error) {
        console.error('Błąd startowania śledzenia:', error);
        setAlertMessage('Nie można rozpocząć śledzenia');
      }
    } else {
      setAlertMessage('Nie można rozpocząć nagrywania - brak lokalizacji');
    }
  };

  const stopTracking = async () => {
    try {
      await Location.stopLocationUpdatesAsync(BACKGROUND_TRACKING_TASK);
      
      delete global.setCoordinates;

      setIsTracking(false);
      setIsModalVisible(true);
    } catch (error) {
      console.error('Błąd zatrzymywania śledzenia:', error);
      setIsTracking(false);
      setIsModalVisible(true);
    }
  };

  const saveTrail = async () => {
    const token = await AsyncStorage.getItem('authToken');
    const decoded = jwtDecode(token);

    const formattedCoordinates = coordinates.map((coord, index) => ({
      latitude: coord.latitude,
      longitude: coord.longitude,
      order: index + 1
    }));

    console.log('Zapisywana trasa:', {
      name: trailName,
      type: TRAIL_TYPES[trailType],
      pointsCount: formattedCoordinates.length,
      points: formattedCoordinates.map(coord => ({
        order: coord.order,
        latitude: coord.latitude.toFixed(6),
        longitude: coord.longitude.toFixed(6)
      }))
    });

    const trailData = JSON.stringify({
      ownerId: decoded.id,
      name: trailName,
      type: TRAIL_TYPES[trailType],
      coordinates: formattedCoordinates,
      visibility: "Private"
    });

    try {
      const response = await fetch(endpoints.trails, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: trailData
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Błąd podczas wysyłania danych:', errorData);
        setAlertMessage('Nie udało się zapisać trasy. Spróbuj ponownie.');
      } else {
        setAlertMessage('Trasa została zapisana pomyślnie!');
        setIsModalVisible(false);
        setTrailName('');
        setTrailType('');
        setCoordinates([]);
        fetchTrails();
      }
    } catch (error) {
      console.error('Błąd połączenia:', error);
      setAlertMessage('Wystąpił błąd podczas komunikacji z serwerem. Spróbuj ponownie.');
    }
  };
  
  const cancelTrail = () => {
    setIsModalVisible(false);
    setTrailName('');
    setTrailType('');
    setCoordinates([]);
  };

  useImperativeHandle(ref, () => ({
    startTracking,
    stopTracking
  }));

  return (
    <>
      {isTracking && (
        <View 
          style={{ 
            position: 'absolute', 
            top: StatusBar.currentHeight + 20,
            left: 20,
            right: 20,
            zIndex: 2
          }}
        >
          <TrailRecordingStats 
            coordinates={coordinates}
            startTime={recordingStartTime}
          />
        </View>
      )}

      <TrailSave 
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={saveTrail}
        onCancel={cancelTrail}
        trailName={trailName}
        setTrailName={setTrailName}
        trailType={trailType}
        setTrailType={setTrailType}
      />
    </>
  );
});

export default TrailRecording; 
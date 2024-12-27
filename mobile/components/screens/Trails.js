import React, { useState, useEffect, useRef } from 'react';
import { View, PermissionsAndroid, Platform, TouchableOpacity, Text, Image } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import Alert from '../utils/Alert';
import { SafeAreaView } from 'react-native-safe-area-context';
import CenterIcon from '../../assets/icons/paper-plane-regular.svg';

export default function Trails() {
  const [location, setLocation] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const mapCamera = useRef(null);
  let watchId = useRef(null);

  
  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Uprawnienia Lokalizacji',
              message: 'Aplikacja wymaga dostępu do lokalizacji, aby wyświetlić pobliskie szlaki.',
              buttonPositive: 'OK',
            }
          );

          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            setAlertMessage('Uprawnienia lokalizacji są wymagane do korzystania z tej funkcji. Proszę włączyć je w ustawieniach aplikacji.');
            return;
          }
        }

        Geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
          },
          (error) => {
            setAlertMessage(`Nie udało się pobrać lokalizacji: ${error.message}`);
          },
          { enableHighAccuracy: true }
        );

        watchId.current = Geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
          },
          (error) => {
            setAlertMessage(`Nie udało się pobrać lokalizacji: ${error.message}`);
          },
          { enableHighAccuracy: true, distanceFilter: 1, interval: 5000, fastestInterval: 2000 }
        );
      } catch (err) {
        setAlertMessage('Wystąpił błąd podczas próby uzyskania dostępu do lokalizacji.');
        console.warn(err);
      }
    };

    requestLocationPermission();

    return () => {
      if (watchId.current !== null) {
        Geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isTracking) {
      watchId.current = Geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });

          setCoordinates((prevLocations) => {
            const newOrder = prevLocations.length + 1;
            return [...prevLocations, {  order: newOrder , latitude, longitude}];
          });
        },
        (error) => {
          setAlertMessage(`Nie udało się pobrać lokalizacji: ${error.message}`);
        },
        { enableHighAccuracy: true, distanceFilter: 1, interval: 5000, fastestInterval: 2000 }
      );
    } else {
      if (watchId.current !== null) {
        Geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
    }
  }, [isTracking]);

  const startTracking = () => {
    setIsTracking(true);
  };

  const stopTracking = async () => {
    setIsTracking(false);
    console.log('Tracked Locations:', coordinates);
    const token = await AsyncStorage.getItem('authToken');
    const decoded = jwtDecode(token);
  
    const trailData = JSON.stringify({
      ownerId: decoded.id,
      name: `trasa-${Date.now()}`,
      coordinates: coordinates,
    });
    console.log(trailData);

    try {
      const response = await fetch('http://10.0.2.2:5253/api/trails', {
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
        console.log('Trasa została zapisana pomyślnie!');
        setAlertMessage('Trasa została zapisana pomyślnie!');
      }
    } catch (error) {
      console.error('Błąd połączenia:', error);
      setAlertMessage('Wystąpił błąd podczas komunikacji z serwerem. Spróbuj ponownie.');
    }
  };
  

  const centerMapOnMarker = () => {
    if (location && mapCamera.current) {
      mapCamera.current.setCamera({
        centerCoordinate: [location.longitude, location.latitude],
        zoomLevel: 16,
        animationDuration: 1000,
      });
    }
  };

  if (!location) {
    return <View className="flex-1" />;
  }

  return (
    <SafeAreaView className="flex-1">
      {alertMessage && <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />}
      <MapboxGL.MapView style={{ flex: 1 }}>
        <MapboxGL.Camera
          ref={mapCamera}
          zoomLevel={16}
          centerCoordinate={[location.longitude, location.latitude]}
        />
        <MapboxGL.PointAnnotation
          id="userLocation"
          coordinate={[location.longitude, location.latitude]}
        >
          <View className="flex items-center justify-center w-8 h-8">
            <View className="w-8 h-8 rounded-full bg-primary border-2 border-white" />
          </View>
        </MapboxGL.PointAnnotation>
      </MapboxGL.MapView>

      <TouchableOpacity
        className="absolute bottom-5 right-5 bg-primary p-4 rounded-full shadow-md"
        onPress={isTracking ? stopTracking : startTracking}
      >
        <Text className="text-white font-bold text-base">{isTracking ? 'Zakończ trasę' : 'Rozpocznij trasę'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="absolute bottom-24 right-5 bg-primary p-4 rounded-full shadow-md"
        onPress={centerMapOnMarker}
      >
        <CenterIcon width={24} height={24} fill="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

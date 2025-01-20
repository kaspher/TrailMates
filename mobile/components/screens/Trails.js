import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, PermissionsAndroid, Platform, TouchableOpacity, Text, Image, Modal, TextInput, ScrollView, StatusBar } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import Alert from '../utils/Alert';
import { SafeAreaView } from 'react-native-safe-area-context';
import LocationIcon from '../../assets/icons/location-arrow-solid.svg';
import { PUBLIC_MAPBOX_ACCESS_TOKEN } from '@env';
import { getAddressFromCoordinates } from '../trailUtils/Geocoding';

import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue 
} from 'react-native-reanimated';
import LayerIcon from '../../assets/icons/layer-group-solid.svg';
import LocationPinIcon from '../../assets/icons/location-pin-solid.svg';
import FlagIcon from '../../assets/icons/flag-checkered-solid.svg';
import { Animated as RNAnimated } from 'react-native';
import TrailDetails from '../trailUtils/TrailDetails';
import { 
  calculateDistance, 
  calculateTotalDistance, 
  formatDistance, 
  formatDistanceWithUnit 
} from '../trailUtils/CalculateDistance';
import TrailRecordingStats from '../trailUtils/TrailRecordingStats';
import MapControls from '../trailUtils/MapControls';
import PlayIcon from '../../assets/icons/circle-play-solid.svg';
import PauseIcon from '../../assets/icons/circle-pause-solid.svg';
import TrailSave from '../trailUtils/TrailSave';
import TrailRefresh from '../trailUtils/TrailRefresh';
import TrailList from '../trailUtils/TrailList';
import MapBottomControls from '../trailUtils/MapBottomControls';
import TrailMapView from '../trailUtils/TrailMapView';

const TRAIL_TYPES = {
  'Pieszy': 'Trekking',
  'Rowerowy': 'Cycling',
  'Biegowy': 'Running'
};

export default function Trails({ route, navigation }) {
  const [location, setLocation] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const mapCamera = useRef(null);
  let watchId = useRef(null);
  const [trails, setTrails] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [trailName, setTrailName] = useState('');
  const [trailType, setTrailType] = useState('');
  const [selectedTrail, setSelectedTrail] = useState(null);
  const [isTrailDetailsModalVisible, setIsTrailDetailsModalVisible] = useState(false);
  const [startAddress, setStartAddress] = useState(null);
  const [endAddress, setEndAddress] = useState(null);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['40%', '60%', '85%'], []);
  const translateY = useSharedValue(1000);
  const [mapStyle, setMapStyle] = useState('Streets');
  const [isLocationReady, setIsLocationReady] = useState(false);
  const [pulseAnim] = useState(new RNAnimated.Value(1));
  const [activeTrailId, setActiveTrailId] = useState(null);
  const [isTrailListModalVisible, setIsTrailListModalVisible] = useState(false);
  const [recordingStartTime, setRecordingStartTime] = useState(null);
  const nearbyListTranslateY = useSharedValue(1000);

  const bottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const nearbyListStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: nearbyListTranslateY.value }]
  }));

  const handleTouchStart = (event) => {
    setTouchStart(event.nativeEvent.pageX);
  };

  const handleTouchEnd = (event) => {
    const swipeDistance = event.nativeEvent.pageX - touchStart;
    if (Math.abs(swipeDistance) > 100) {
      if (swipeDistance > 0) {
        goToPrevTrail();
      } else {
        goToNextTrail();
      }
    }
  };
  
  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        if (Platform.OS === 'android') {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
        }

        Geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
            setIsLocationReady(true);
          },
          (error) => {
            console.error('Błąd lokalizacji:', error);
            setAlertMessage('Włącz lokalizację, aby korzystać z aplikacji');
          },
          { enableHighAccuracy: true }
        );

        watchId.current = Geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
          },
          (error) => {
            console.error('Błąd lokalizacji:', error);
            setAlertMessage('Włącz lokalizację, aby korzystać z aplikacji');
          },
          { enableHighAccuracy: true, distanceFilter: 1, interval: 5000, fastestInterval: 2000 }
        );
      } catch (err) {
        console.warn(err);
        setAlertMessage('Włącz lokalizację, aby korzystać z aplikacji');
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
    if (isTracking && location) {
      setCoordinates(prev => {
        const lastCoord = prev[prev.length - 1];
        if (lastCoord && 
            lastCoord.latitude === location.latitude && 
            lastCoord.longitude === location.longitude) {
          return prev;
        }

        return [
          ...prev,
          {
            order: prev.length + 1,
            latitude: location.latitude,
            longitude: location.longitude
          }
        ];
      });
    }
  }, [isTracking, location]);

  useEffect(() => {
    if (isTracking) {
      watchId.current = Geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          setAlertMessage(`Nie udało się pobrać lokalizacji: ${error.message}`);
        },
        { 
          enableHighAccuracy: true, 
          distanceFilter: 5,
          interval: 3000, 
          fastestInterval: 2000 
        }
      );
    } else {
      if (watchId.current !== null) {
        Geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
    }

    return () => {
      if (watchId.current !== null) {
        Geolocation.clearWatch(watchId.current);
      }
    };
  }, [isTracking]);

  const startTracking = () => {
    if (location) {
    setIsTracking(true);
      setRecordingStartTime(new Date().getTime());
      setCoordinates([{
        order: 1,
        latitude: location.latitude,
        longitude: location.longitude
      }]);
    } else {
      setAlertMessage('Nie można rozpocząć nagrywania - brak lokalizacji');
    }
  };

  const stopTracking = () => {
    setIsTracking(false);
    setIsModalVisible(true);
  };

  const saveTrail = async () => {
    const token = await AsyncStorage.getItem('authToken');
    const decoded = jwtDecode(token);

    const formattedCoordinates = coordinates.map((coord, index) => ({
      latitude: coord.latitude,
      longitude: coord.longitude,
      order: index + 1
    }));
  
    const trailData = JSON.stringify({
      ownerId: decoded.id,
      name: trailName,
      type: TRAIL_TYPES[trailType],
      coordinates: formattedCoordinates,
      visibility: "Private"
    });

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

  const centerMapOnMarker = () => {
    if (location && mapCamera.current) {
      mapCamera.current.setCamera({
        centerCoordinate: [location.longitude, location.latitude],
        zoomLevel: 16,
        animationDuration: 1000,
      });
    }
  };

  const fetchTrails = async () => {
    try {
      const response = await fetch('http://10.0.2.2:5253/api/trails');
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

  const fetchTrailDetails = async (trailId) => {
    try {
      hideNearbyList();
      
      const response = await fetch(`http://10.0.2.2:5253/api/trails/${trailId}`);
      if (!response.ok) {
        throw new Error('Nie udało się pobrać szczegółów trasy');
      }
      const data = await response.json();
      
      if (!data || !data.coordinates || data.coordinates.length === 0) {
        throw new Error('Brak danych współrzędnych trasy');
      }

      setSelectedTrail(data);
      setIsBottomSheetVisible(true);
      setActiveTrailId(trailId);

      const coordinates = data.coordinates.sort((a, b) => a.order - b.order);
      const startPoint = coordinates[0];
      const endPoint = coordinates[coordinates.length - 1];

      const startAddr = await getAddressFromCoordinates(
        startPoint.longitude, 
        startPoint.latitude
      );
      
      const endAddr = await getAddressFromCoordinates(
        endPoint.longitude, 
        endPoint.latitude
      );

      setStartAddress(startAddr);
      setEndAddress(endAddr);
    } catch (error) {
      console.error('Błąd podczas pobierania szczegółów trasy:', error);
      setAlertMessage('Nie udało się pobrać szczegółów trasy');
    }
  };

  const closeBottomSheet = () => {
    translateY.value = withSpring(1000, {
      damping: 50,
      stiffness: 300,
    });
    setIsBottomSheetVisible(false);
    setSelectedTrail(null);
    setStartAddress(null);
    setEndAddress(null);
  };

  const toggleMapStyle = () => {
    setMapStyle(prev => prev === 'Streets' ? 'Satellite' : 'Streets');
  };

  useEffect(() => {
    if (route.params?.selectedTrailId && route.params?.shouldShowDetails) {
      fetchTrailDetails(route.params.selectedTrailId);
      
      const selectedTrail = trails.find(t => t.id === route.params.selectedTrailId);
      if (selectedTrail && selectedTrail.coordinates.length > 0) {
        const firstCoord = selectedTrail.coordinates[0];
        mapCamera.current?.setCamera({
          centerCoordinate: [firstCoord.longitude, firstCoord.latitude],
          zoomLevel: 14,
          animationDuration: 1000,
        });
      }
    }
  }, [route.params, trails]);

  const startPulseAnimation = () => {
    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(pulseAnim, {
          toValue: 1.5,
          duration: 1000,
          useNativeDriver: true
        }),
        RNAnimated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true
        })
      ])
    ).start();
  };

  const canJoinTrail = (trailStartPoint) => {
    if (!location || !trailStartPoint) return false;
    
    const distance = calculateDistance(
      location.latitude,
      location.longitude,
      trailStartPoint.latitude,
      trailStartPoint.longitude
    );
    
    return distance * 1000 <= 20;
  };

  const handleJoinTrail = () => {
    const startPoint = selectedTrail.coordinates.sort((a, b) => a.order - b.order)[0];
    if (canJoinTrail(startPoint)) {
      // dodać logikę dołączania do trasy
      setAlertMessage('Dołączono do trasy!');
    } else {
      setAlertMessage('Jesteś za daleko by dołączyć');
    }
  };

  const resetMapOrientation = () => {
    mapCamera.current?.setCamera({
      heading: 0,
      animationDuration: 500,
    });
  };

  const showNearbyList = () => {
    nearbyListTranslateY.value = withSpring(0, {
      damping: 20,
      stiffness: 100,
      mass: 1,
      velocity: 0.5
    });
  };

  const hideNearbyList = () => {
    nearbyListTranslateY.value = withSpring(1000, {
      damping: 20,
      stiffness: 100,
      mass: 1,
      velocity: 0.5
    });
  };

  const refreshTrails = async () => {
    try {
      const response = await fetch('http://10.0.2.2:5253/api/trails');
      const data = await response.json();
      setTrails(data);
    } catch (error) {
      console.error('Błąd podczas odświeżania tras:', error);
      setAlertMessage('Nie udało się odświeżyć tras');
    }
  };

  if (!location || !isLocationReady) {
    return (
      <View className="flex-1 bg-light items-center justify-center">
        <Text>Pobieranie lokalizacji...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      
      <TrailMapView 
        mapStyle={mapStyle}
        location={location}
        isTracking={isTracking}
        coordinates={coordinates}
        trails={trails}
        activeTrailId={activeTrailId}
        fetchTrailDetails={fetchTrailDetails}
        mapCamera={mapCamera}
      />

      {alertMessage && (
        <View style={{ position: 'absolute', width: '100%', top: 0, zIndex: 2 }}>
          <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />
        </View>
      )}
      
      <View style={{ position: 'absolute', width: '100%', top: 0, zIndex: 1 }}>
        <TrailRefresh onRefresh={refreshTrails} />
      </View>

      <View 
        style={{ 
          position: 'absolute', 
          top: StatusBar.currentHeight + 20, 
          right: 20, 
          zIndex: 1 
        }}
      >
        <MapControls 
          onCenterPress={centerMapOnMarker}
          onStylePress={toggleMapStyle}
          onNorthPress={resetMapOrientation}
          mapStyle={mapStyle}
        />
      </View>

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

      <View style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 1 }} pointerEvents="box-none">
        <TrailList 
          nearbyListStyle={nearbyListStyle}
          hideNearbyList={hideNearbyList}
          location={location}
          trails={trails}
          fetchTrailDetails={fetchTrailDetails}
        />
      </View>

      <View style={{ position: 'absolute', bottom: 0, width: '100%' }}>
        <MapBottomControls 
          isTracking={isTracking}
          onStartTracking={startTracking}
          onStopTracking={stopTracking}
          onHelpPress={() => setAlertMessage('Funkcja pomocy będzie dostępna wkrótce')}
          onShowNearbyList={showNearbyList}
        />
      </View>

      {isBottomSheetVisible && selectedTrail && (
        <TrailDetails 
          selectedTrail={selectedTrail}
          startAddress={startAddress}
          endAddress={endAddress}
          onClose={() => {
            setIsBottomSheetVisible(false);
            setSelectedTrail(null);
            setStartAddress(null);
            setEndAddress(null);
          }}
          handleJoinTrail={handleJoinTrail}
          onPublish={() => setAlertMessage('Funkcja publikowania będzie dostępna wkrótce')}
          canJoinTrail={canJoinTrail}
          formatDistance={formatDistance}
          calculateTotalDistance={calculateTotalDistance}
          userLocation={location}
        />
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
    </View>
  );
}

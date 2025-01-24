import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, PermissionsAndroid, Platform, Text, StatusBar } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import Alert from '../utils/Alert';
import { getAddressFromCoordinates } from '../trailUtils/Geocoding';
import { endpoints } from '../../config';

import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue 
} from 'react-native-reanimated';
import { Animated as RNAnimated } from 'react-native';
import TrailDetails from '../trailUtils/TrailDetails';
import { 
  calculateDistance, 
  calculateTotalDistance, 
  formatDistance, 
} from '../trailUtils/CalculateDistance';
import MapControls from '../trailUtils/MapControls';
import TrailRefresh from '../trailUtils/TrailRefresh';
import TrailList from '../trailUtils/TrailList';
import MapBottomControls from '../trailUtils/MapBottomControls';
import TrailMapView from '../trailUtils/TrailMapView';
import TrailRecording from '../trailUtils/TrailRecording';

const TRAIL_TYPES = {
  'Pieszy': 'Trekking',
  'Rowerowy': 'Cycling',
  'Biegowy': 'Running'
};

export default function Trails({ route, navigation }) {
  const [location, setLocation] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [trails, setTrails] = useState([]);
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
  const nearbyListTranslateY = useSharedValue(1000);
  const [isFollowingUser, setIsFollowingUser] = useState(true);
  const mapCamera = useRef(null);
  let watchId = useRef(null);
  const [coordinates, setCoordinates] = useState([]);
  const recordingRef = useRef(null);
  const [temporaryTrail, setTemporaryTrail] = useState(null);

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

  const handleMapInteraction = () => {
    if (isFollowingUser) {
      setIsFollowingUser(false);
    }
  };

  const centerMapOnMarker = () => {
    if (location && mapCamera.current) {
      mapCamera.current.setCamera({
        centerCoordinate: [location.longitude, location.latitude],
        zoomLevel: 16,
        animationDuration: 1000,
      });
      setIsFollowingUser(true);
    }
  };

  const fetchTrails = async () => {
    try {
      const response = await fetch(endpoints.trails);
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
      
      const response = await fetch(endpoints.trailDetails(trailId));
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
      
      if (data.visibility === 'Private') {
        setTemporaryTrail(data);
      }

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
    setTemporaryTrail(null);
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
      const response = await fetch(endpoints.trails);
      const data = await response.json();
      setTrails(data);
    } catch (error) {
      console.error('Błąd podczas odświeżania tras:', error);
      setAlertMessage('Nie udało się odświeżyć tras');
    }
  };

  const handleCloseTrailDetails = () => {
    setSelectedTrail(null);
    setActiveTrailId(null);
    setTemporaryTrail(null);
  };

  const handleTrailShare = async (trailId) => {
    try {
      const response = await fetch(endpoints.trailVisibility(trailId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visibility: 'Public'
        })
      });

      if (response.ok) {
        setAlertMessage('Trasa została udostępniona!');
        fetchTrails(); // Odświeżamy listę tras
        handleCloseTrailDetails();
      } else {
        setAlertMessage('Nie udało się udostępnić trasy');
      }
    } catch (error) {
      console.error('Błąd podczas udostępniania trasy:', error);
      setAlertMessage('Wystąpił błąd podczas udostępniania trasy');
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
        isFollowingUser={isFollowingUser}
        onUserInteraction={handleMapInteraction}
        temporaryTrail={temporaryTrail}
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

      <View style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 1 }} pointerEvents="box-none">
        <TrailList 
          nearbyListStyle={nearbyListStyle}
          hideNearbyList={hideNearbyList}
          location={location}
          trails={trails}
          fetchTrailDetails={fetchTrailDetails}
        />
      </View>

      <TrailRecording 
        ref={recordingRef}
        isTracking={isTracking}
        setIsTracking={setIsTracking}
        location={location}
        setAlertMessage={setAlertMessage}
        fetchTrails={fetchTrails}
        coordinates={coordinates}
        setCoordinates={setCoordinates}
      />

      <View style={{ position: 'absolute', bottom: 0, width: '100%' }}>
        <MapBottomControls 
          isTracking={isTracking}
          onStartTracking={() => recordingRef.current?.startTracking()}
          onStopTracking={() => recordingRef.current?.stopTracking()}
          onHelpPress={() => setAlertMessage('Funkcja pomocy będzie dostępna wkrótce')}
          onShowNearbyList={showNearbyList}
        />
      </View>

      {isBottomSheetVisible && selectedTrail && (
        <TrailDetails 
          selectedTrail={selectedTrail}
          startAddress={startAddress}
          endAddress={endAddress}
          onClose={handleCloseTrailDetails}
          handleJoinTrail={handleJoinTrail}
          canJoinTrail={canJoinTrail}
          formatDistance={formatDistance}
          calculateTotalDistance={calculateTotalDistance}
          userLocation={location}
          onTrailShare={handleTrailShare}
          setAlertMessage={setAlertMessage}
        />
      )}
    </View>
  );
}

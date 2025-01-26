import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, PermissionsAndroid, Platform, Text, StatusBar, Linking } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import Alert from '../utils/Alert';
import { getAddressFromCoordinates } from '../utils/trails/Geocoding';
import { endpoints } from '../../config';

import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue 
} from 'react-native-reanimated';
import { Animated as RNAnimated } from 'react-native';
import TrailDetails from '../utils/trails/TrailDetails';
import { 
  calculateDistance, 
  calculateTotalDistance, 
  formatDistance,
  calculateBounds
} from '../utils/trails/CalculateDistance';
import MapControls from '../utils/trails/MapControls';
import TrailRefresh from '../utils/trails/TrailRefresh';
import TrailList from '../utils/trails/TrailList';
import MapBottomControls from '../utils/trails/MapBottomControls';
import TrailMapView from '../utils/trails/TrailMapView';
import TrailRecording from '../utils/trails/TrailRecording';
import TrailParticipate from '../utils/trails/TrailParticipate';

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
  const translateY = useSharedValue(1000);
  const [mapStyle, setMapStyle] = useState('Streets');
  const [isLocationReady, setIsLocationReady] = useState(false);
  const [pulseAnim] = useState(new RNAnimated.Value(1));
  const [activeTrailId, setActiveTrailId] = useState(null);
  const nearbyListTranslateY = useSharedValue(1000);
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const mapCamera = useRef(null);
  let watchId = useRef(null);
  const [coordinates, setCoordinates] = useState([]);
  const recordingRef = useRef(null);
  const [temporaryTrail, setTemporaryTrail] = useState(null);
  const [isParticipating, setIsParticipating] = useState(false);
  const [activeParticipationTrail, setActiveParticipationTrail] = useState(null);
  const [is3DMode, setIs3DMode] = useState(false);

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
  
  const initializeLocation = async () => {
    try {
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
        { 
          enableHighAccuracy: true, 
          distanceFilter: 1, 
          interval: 5000, 
          fastestInterval: 2000 
        }
      );
    } catch (err) {
      console.warn(err);
      setAlertMessage('Włącz lokalizację, aby korzystać z aplikacji');
    }
  };

  // Sprawdzanie uprawnień i inicjalizacja lokalizacji
  useEffect(() => {
    const checkPermissionAndInitialize = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
          );
          
          if (!granted) {
            const backgroundGranted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
              {
                title: "Dostęp do lokalizacji",
                message: "Aplikacja potrzebuje uprawnień do korzystania z lokalizacji urządzenia na najwyższym poziomie",
                buttonPositive: "Przejdź do ustawień",
              }
            );

            if (backgroundGranted !== PermissionsAndroid.RESULTS.GRANTED) {
              Linking.openSettings();
              return;
            }
          }
          
          await initializeLocation();
        } catch (error) {
          console.error('Błąd podczas sprawdzania uprawnień:', error);
          setAlertMessage('Wystąpił błąd podczas sprawdzania uprawnień');
        }
      } else {
        await initializeLocation();
      }
    };

    checkPermissionAndInitialize();

    // Nasłuchiwanie na powrót do aplikacji
    const unsubscribe = navigation.addListener('focus', () => {
      checkPermissionAndInitialize();
    });

    return () => {
      if (watchId.current !== null) {
        Geolocation.clearWatch(watchId.current);
      }
      unsubscribe();
    };
  }, [navigation]);

  const handleLocationPress = () => {
    setIsFollowingUser(prev => !prev);
  };

  const handleUserInteraction = () => {
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
      // Wyłączamy śledzenie użytkownika przy każdym wyborze trasy
      setIsFollowingUser(false);

      const response = await fetch(endpoints.trailDetails(trailId));
      if (response.ok) {
        const data = await response.json();
        setSelectedTrail(data);
        setActiveTrailId(data.id);
        setTemporaryTrail(data);
        setIsTrailDetailsModalVisible(true);

        // Pobierz adresy dla punktów startowego i końcowego
        const sortedCoordinates = data.coordinates.sort((a, b) => a.order - b.order);
        const startPoint = sortedCoordinates[0];
        const endPoint = sortedCoordinates[sortedCoordinates.length - 1];

        const startAddressData = await getAddressFromCoordinates(
          startPoint.latitude,
          startPoint.longitude
        );
        setStartAddress(startAddressData);

        const endAddressData = await getAddressFromCoordinates(
          endPoint.latitude,
          endPoint.longitude
        );
        setEndAddress(endAddressData);

        // Wycentruj mapę na trasie
        if (mapCamera.current) {
          const bounds = calculateBounds(
            data.coordinates.map(coord => [coord.longitude, coord.latitude])
          );
          
          if (bounds) {
            mapCamera.current.fitBounds(
              bounds.ne,
              bounds.sw,
              50,
              1000
            );
          }
        }
      }
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

  const handleStartTracking = () => {
    recordingRef.current?.startTracking();
    setIsFollowingUser(true);
    setIs3DMode(true);
  };

  const handleStartParticipation = (trail) => {
    setIsParticipating(true);
    setActiveParticipationTrail(trail);
    setIsFollowingUser(true);
    setIs3DMode(true);
    setIsTrailDetailsModalVisible(false);
  };

  const handleEndParticipation = () => {
    setIsParticipating(false);
    setActiveParticipationTrail(null);
    setIs3DMode(false);
  };

  const handleStopTracking = () => {
    recordingRef.current?.stopTracking();
    setIs3DMode(false);
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
        onUserInteraction={handleUserInteraction}
        temporaryTrail={temporaryTrail}
        activeParticipationTrail={activeParticipationTrail}
        isFollowingUser={isFollowingUser}
        is3DMode={is3DMode}
        setIsFollowingUser={setIsFollowingUser}
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
          onLocationPress={handleLocationPress}
          onLayerPress={toggleMapStyle}
          isFollowingUser={isFollowingUser}
          is3DMode={is3DMode}
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
          onStartTracking={handleStartTracking}
          onStopTracking={handleStopTracking}
          onHelpPress={() => setAlertMessage('Funkcja pomocy będzie dostępna wkrótce')}
          onShowNearbyList={showNearbyList}
          isParticipating={isParticipating}
          onStopParticipating={handleEndParticipation}
        />
      </View>

      {isTrailDetailsModalVisible && selectedTrail && (
        <TrailDetails 
          selectedTrail={selectedTrail}
          startAddress={startAddress}
          endAddress={endAddress}
          onClose={handleCloseTrailDetails}
          canJoinTrail={canJoinTrail}
          formatDistance={formatDistance}
          calculateTotalDistance={calculateTotalDistance}
          userLocation={location}
          onTrailShare={handleTrailShare}
          setAlertMessage={setAlertMessage}
          setActiveParticipationTrail={handleStartParticipation}
        />
      )}

      {isParticipating && activeParticipationTrail && (
        <TrailParticipate 
          selectedTrail={activeParticipationTrail}
          userLocation={location}
          setAlertMessage={setAlertMessage}
          onClose={handleEndParticipation}
          setActiveParticipationTrail={setActiveParticipationTrail}
        />
      )}
    </View>
  );
}

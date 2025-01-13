import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, PermissionsAndroid, Platform, TouchableOpacity, Text, Image, Modal, TextInput, ScrollView } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import Alert from '../utils/Alert';
import { SafeAreaView } from 'react-native-safe-area-context';
import LocationIcon from '../../assets/icons/location-arrow-solid.svg';
import { PUBLIC_MAPBOX_ACCESS_TOKEN } from '@env';

import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue 
} from 'react-native-reanimated';
import LayerIcon from '../../assets/icons/layer-group-solid.svg';
import LocationPinIcon from '../../assets/icons/location-pin-solid.svg';
import FlagIcon from '../../assets/icons/flag-checkered-solid.svg';
import { Animated as RNAnimated } from 'react-native';

const TRAIL_TYPES = {
  'Pieszy': 'Trekking',
  'Rowerowy': 'Cycling',
  'Biegowy': 'Running'
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const calculateTotalDistance = (coordinates) => {
  let totalDistance = 0;
  for (let i = 0; i < coordinates.length - 1; i++) {
    totalDistance += calculateDistance(
      coordinates[i].latitude,
      coordinates[i].longitude,
      coordinates[i + 1].latitude,
      coordinates[i + 1].longitude
    );
  }
  return totalDistance;
};

const getAddressFromCoordinates = async (longitude, latitude) => {
  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${PUBLIC_MAPBOX_ACCESS_TOKEN}&language=pl`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      let street = null;
      let city = null;

      
      data.features.forEach((feature) => {
        if (
          feature.place_type.includes("address") ||
          feature.place_type.includes("street")
        ) {
          street = feature.text;
        }
        if (feature.place_type.includes("place")) {
          city = feature.text;
        }
      });

      if (!street && data.features[0]) {
        street = data.features[0].text;
      }

      if (!city && data.features[0].context) {
        const cityContext = data.features[0].context.find((item) =>
          item.id.startsWith("place")
        );
        if (cityContext) {
          city = cityContext.text;
        }
      }

      const result = {
        street: street || 'Nieznana ulica',
        city: city || 'Nieznane miasto'
      };
      return result;
    }
    return {
      street: 'Nieznana ulica',
      city: 'Nieznane miasto'
    };
  } catch (error) {
    return {
      street: 'Nieznana ulica',
      city: 'Nieznane miasto'
    };
  }
};

const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  return `${distance.toFixed(2)} km`;
};

const formatDistanceWithUnit = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
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
  const [is3DEnabled, setIs3DEnabled] = useState(false);
  const [isLocationReady, setIsLocationReady] = useState(false);
  const [nearbyTrails, setNearbyTrails] = useState([]);
  const [currentNearbyIndex, setCurrentNearbyIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [pulseAnim] = useState(new RNAnimated.Value(1));
  const [activeTrailId, setActiveTrailId] = useState(null);
  const [isTrailListModalVisible, setIsTrailListModalVisible] = useState(false);
  
  const bottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const handleTouchStart = (event) => {
    setTouchStart(event.nativeEvent.pageX);
  };

  const handleTouchEnd = (event) => {
    const swipeDistance = event.nativeEvent.pageX - touchStart;
    if (Math.abs(swipeDistance) > 100) { // Minimalny dystans przesunięcia
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
            setIsLocationReady(true);
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
      visibility: "Public"
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
      const response = await fetch(`http://10.0.2.2:5253/api/trails/${trailId}`);
      const data = await response.json();
      setSelectedTrail(data);
      setActiveTrailId(trailId);

      const sortedCoordinates = data.coordinates.sort((a, b) => a.order - b.order);
      const midIndex = Math.floor(sortedCoordinates.length / 2);
      const midPoint = sortedCoordinates[midIndex];
      
      mapCamera.current?.setCamera({
        centerCoordinate: [midPoint.longitude, midPoint.latitude],
        zoomLevel: 14,
        animationDuration: 1000,
      });

      const startCoord = sortedCoordinates[0];
      const endCoord = sortedCoordinates[sortedCoordinates.length - 1];

      const start = await getAddressFromCoordinates(startCoord.longitude, startCoord.latitude);
      const end = await getAddressFromCoordinates(endCoord.longitude, endCoord.latitude);

      setStartAddress(start);
      setEndAddress(end);
      translateY.value = withSpring(0);
      setIsBottomSheetVisible(true);
      startPulseAnimation();
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

  const toggle3DView = () => {
    setIs3DEnabled(prev => !prev);
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

  const findNearbyTrails = (userLat, userLng, allTrails, maxDistance = 5) => {
    return allTrails
      .map(trail => {
        const startPoint = trail.coordinates
          .sort((a, b) => a.order - b.order)[0];
        
        const distance = calculateDistance(
          userLat,
          userLng,
          startPoint.latitude,
          startPoint.longitude
        );

        return { ...trail, distance };
      })
      .filter(trail => trail.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance);
  };

  useEffect(() => {
    if (location && trails.length > 0) {
      const nearby = findNearbyTrails(location.latitude, location.longitude, trails);
      setNearbyTrails(nearby);
      setCurrentNearbyIndex(0);
    }
  }, [location, trails]);

  const goToNextTrail = () => {
    if (currentNearbyIndex < nearbyTrails.length - 1) {
      setCurrentNearbyIndex(prev => prev + 1);
      fetchTrailDetails(nearbyTrails[currentNearbyIndex + 1].id);
    }
  };

  const goToPrevTrail = () => {
    if (currentNearbyIndex > 0) {
      setCurrentNearbyIndex(prev => prev - 1);
      fetchTrailDetails(nearbyTrails[currentNearbyIndex - 1].id);
    }
  };

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
    
    // Konwertuj kilometry na metry i sprawdź czy jest bliżej niż 20m
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

  if (!location || !isLocationReady) {
    return (
      <View className="flex-1 bg-light items-center justify-center">
        <Text>Pobieranie lokalizacji...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-light">
      {alertMessage && <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />}
        <View className="flex-1">
          <MapboxGL.MapView 
            style={{ flex: 1 }}
            styleURL={mapStyle === 'Streets' ? 
              MapboxGL.StyleURL.Street : 
              MapboxGL.StyleURL.Satellite
            }
          >
        <MapboxGL.Camera
          ref={mapCamera}
          zoomLevel={16}
              pitch={is3DEnabled ? 45 : 0}
          centerCoordinate={[location.longitude, location.latitude]}
              defaultSettings={{
                centerCoordinate: [location.longitude, location.latitude],
                zoomLevel: 16
              }}
            />
            
            {trails && trails.length > 0 && trails.map((trail) => {
              const formattedCoordinates = trail.coordinates
                .sort((a, b) => a.order - b.order)
                .map(coord => [coord.longitude, coord.latitude]);

              return (
                <React.Fragment key={trail.id}>
                  <MapboxGL.ShapeSource
                    id={`source-${trail.id}`}
                    shape={{
                      type: 'Feature',
                      properties: {
                        name: trail.name,
                        type: trail.type,
                        owner: trail.ownerFullName
                      },
                      geometry: {
                        type: 'LineString',
                        coordinates: formattedCoordinates
                      }
                    }}
                    onPress={() => {
                      fetchTrailDetails(trail.id);
                    }}
                  >
                    <MapboxGL.LineLayer
                      id={`layer-${trail.id}`}
                      style={{
                        lineColor: trail.type === 'Cycling' ? '#F44336' : 
                                  trail.type === 'Trekking' ? '#4CAF50' : 
                                  '#2196F3',
                        lineWidth: trail.id === activeTrailId ? 7 : 5,
                        lineOpacity: trail.id === activeTrailId ? 1 : 0.5,
                      }}
                    />
                    {trail.id === activeTrailId && (
                      <MapboxGL.LineLayer
                        id={`pulse-${trail.id}`}
                        style={{
                          lineColor: trail.type === 'Cycling' ? '#F44336' : 
                                    trail.type === 'Trekking' ? '#4CAF50' : 
                                    '#2196F3',
                          lineWidth: 3,
                          lineOpacity: 0.3,
                          lineDasharray: [2, 2]
                        }}
                      />
                    )}
                  </MapboxGL.ShapeSource>
                </React.Fragment>
              );
            })}

        <MapboxGL.PointAnnotation
          id="userLocation"
          coordinate={[location.longitude, location.latitude]}
        >
          <View className="flex items-center justify-center w-8 h-8">
            <View className="w-8 h-8 rounded-full bg-primary border-2 border-white" />
          </View>
        </MapboxGL.PointAnnotation>
      </MapboxGL.MapView>

          <View className="absolute top-20 right-5">
            <TouchableOpacity
              className="bg-white p-3 rounded-full shadow-md mb-3"
              onPress={centerMapOnMarker}
            >
              <LocationIcon width={24} height={24} fill="#386641" />
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-white p-3 rounded-full shadow-md mb-3"
              onPress={toggleMapStyle}
            >
              <LayerIcon width={24} height={24} fill="#386641" />
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-white px-2 py-3 rounded-full shadow-md w-12 h-12 items-center justify-center mb-3"
              onPress={toggle3DView}
            >
              <Text className="font-bold text-primary text-lg leading-none">
                {is3DEnabled ? '2D' : '3D'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-white p-3 rounded-full shadow-md"
              onPress={resetMapOrientation}
            >
              <Text className="font-bold text-primary text-lg leading-none">N</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="bg-white h-16 px-4 flex-row items-center justify-between border-t border-gray-200">
      <TouchableOpacity
            className="bg-primary px-6 py-2.5 rounded-full"
        onPress={isTracking ? stopTracking : startTracking}
      >
            <Text className="text-white font-medium text-base">
              {isTracking ? 'Zakończ trasę' : 'Rozpocznij trasę'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-primary/10 px-6 py-2.5 rounded-full"
            onPress={() => setIsTrailListModalVisible(true)}
          >
            <Text className="text-primary font-medium text-base">
              Lista tras
            </Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white w-[90%] rounded-lg p-6">
              <Text className="text-xl font-bold mb-4">Zapisz trasę</Text>
              
              <Text className="text-sm font-medium mb-2">Nazwa trasy</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-2 mb-4"
                placeholder="Wprowadź nazwę trasy"
                value={trailName}
                onChangeText={setTrailName}
              />

              <Text className="text-sm font-medium mb-2">Typ trasy</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                className="mb-6"
              >
                {['Pieszy', 'Rowerowy', 'Biegowy'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setTrailType(type)}
                    className={`mr-2 px-4 py-2 rounded-full ${
                      trailType === type ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  >
                    <Text
                      className={`${
                        trailType === type ? 'text-white' : 'text-gray-700'
                      }`}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View className="flex-row justify-between items-center">
                <TouchableOpacity
                  onPress={cancelTrail}
                  className="px-4 py-2 rounded-lg bg-red-500"
                >
                  <Text className="text-white">Odrzuć</Text>
      </TouchableOpacity>

      <TouchableOpacity
                  onPress={saveTrail}
                  className="px-4 py-2 rounded-lg bg-primary"
                  disabled={!trailName || !trailType}
                >
                  <Text className="text-white">Zapisz</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>

      {isBottomSheetVisible && selectedTrail && nearbyTrails.length > 0 && (
        <View 
          className="absolute bottom-20 left-4 right-4 bg-white rounded-xl shadow-lg"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <TouchableOpacity
            onPress={() => {
              setIsBottomSheetVisible(false);
              setSelectedTrail(null);
              setStartAddress(null);
              setEndAddress(null);
            }}
            className="absolute right-2 top-2 p-2 z-20"
          >
            <Text className="text-gray-500 text-xl">✕</Text>
          </TouchableOpacity>

          {nearbyTrails.length > 1 && (
            <>
              <TouchableOpacity 
                onPress={goToPrevTrail}
                className="absolute left-0 top-0 bottom-0 w-12 items-center justify-center z-10"
                disabled={currentNearbyIndex === 0}
              >
                <Text className={`text-3xl ${currentNearbyIndex === 0 ? 'text-gray-300' : 'text-primary'}`}>
                  ←
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={goToNextTrail}
                className="absolute right-0 top-0 bottom-0 w-12 items-center justify-center z-10"
                disabled={currentNearbyIndex === nearbyTrails.length - 1}
              >
                <Text className={`text-3xl ${
                  currentNearbyIndex === nearbyTrails.length - 1 ? 'text-gray-300' : 'text-primary'
                }`}>
                  →
                </Text>
              </TouchableOpacity>
            </>
          )}

          <View className="px-12">
            <View className="p-4">
              <View className="mb-4">
                <Text className="text-xl font-bold text-center">{selectedTrail.name}</Text>
              </View>

              {nearbyTrails.length > 1 && (
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-1">
                    <Text className="text-sm text-gray-500">Trasa w pobliżu</Text>
                    <Text className="text-sm text-gray-600">
                      {formatDistance(nearbyTrails[currentNearbyIndex]?.distance)} od startu
                    </Text>
                  </View>
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
                </View>
              )}

              <View className="h-[1px] bg-gray-200" />

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
            </View>
          </View>
        </View>
      )}

      <Modal
        visible={isTrailListModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsTrailListModalVisible(false)}
      >
        <View className="flex-1 bg-black/50">
          <View className="bg-white mt-20 flex-1 rounded-t-3xl">
            <View className="p-4 border-b border-gray-200 flex-row justify-between items-center">
              <Text className="text-xl font-bold">Trasy w pobliżu</Text>
              <TouchableOpacity
                onPress={() => setIsTrailListModalVisible(false)}
                className="p-2"
              >
                <Text className="text-gray-500 text-xl">✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-4">
              {location && trails
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
                .filter(trail => trail.distance <= 20) // tylko trasy w promieniu 20km
                .sort((a, b) => a.distance - b.distance) // sortowanie po odległości
                .map(trail => (
                  <TouchableOpacity
                    key={trail.id}
                    className="bg-white p-4 rounded-xl shadow-sm mb-3 border border-gray-100"
                    onPress={() => {
                      fetchTrailDetails(trail.id);
                      setIsTrailListModalVisible(false);
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
          </View>
        </View>
      </Modal>
    </View>
  );
}

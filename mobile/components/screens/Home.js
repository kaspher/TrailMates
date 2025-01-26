import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, RefreshControl, TextInput, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAvatarUrl } from '../utils/GetAvatarUrl';
import { formatDistance } from '../utils/trails/CalculateDistance';
import { endpoints } from '../../config';
import Alert from '../utils/Alert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import HeartIcon from '../../assets/icons/heart-solid.svg';
import HeartOutlineIcon from '../../assets/icons/heart-regular.svg';
import CommentIcon from '../../assets/icons/comment-regular.svg';
import { REACT_APP_CLOUDFRONT_DOMAIN_NAME_POSTS } from '@env';

const { width } = Dimensions.get('window');

const ActivityPost = ({ activity, onLike, onComment, currentUserId }) => {
  const [commentUsers, setCommentUsers] = useState({});
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const formattedDate = new Date(activity.createdAt).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const [staticMapUrl, setStaticMapUrl] = useState(null);
  const [trailData, setTrailData] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isLikedByUser = activity.likes.some(like => like.userId === currentUserId);
  const userLike = activity.likes.find(like => like.userId === currentUserId);

  const handleLike = () => {
    if (isLikedByUser && userLike) {
      onLike(activity.id, userLike.id, 'unlike');
    } else {
      onLike(activity.id, null, 'like');
    }
  };

  const handleComment = () => {
    if (commentContent.trim()) {
      onComment(activity.id, commentContent);
      setCommentContent('');
      setShowCommentInput(false);
    }
  };

  useEffect(() => {
    const fetchCommentUsers = async () => {
      try {
        const userPromises = activity.comments.map(comment => 
          fetch(endpoints.users(comment.userId))
            .then(res => res.json())
            .then(userData => ({
              commentId: comment.id,
              userData: userData
            }))
        );

        const users = await Promise.all(userPromises);
        const usersMap = {};
        users.forEach(({ commentId, userData }) => {
          usersMap[commentId] = `${userData.firstName} ${userData.lastName}`;
        });
        setCommentUsers(usersMap);
      } catch (error) {
        console.error('Błąd podczas pobierania danych użytkowników:', error);
      }
    };

    if (activity.comments.length > 0) {
      fetchCommentUsers();
    }
  }, [activity.comments]);

  useEffect(() => {
    const fetchTrailData = async () => {
      if (activity.trailId) {
        try {
          const response = await fetch(endpoints.trailDetails(activity.trailId));
          if (response.ok) {
      const data = await response.json();
            setTrailData(data);
          }
        } catch (error) {
          console.error('Error fetching trail data:', error);
        }
      }
    };

    fetchTrailData();
  }, [activity.trailId]);

  useEffect(() => {
    const generateStaticMap = async () => {
      if (trailData?.coordinates && trailData.coordinates.length > 0) {
        try {
          // Przekształć współrzędne i uprość trasę
          const coordinates = trailData.coordinates
            .sort((a, b) => a.order - b.order)
            .map((coord) => [coord.longitude, coord.latitude]);

          const simplifiedCoordinates = coordinates.filter(
            (_, index) =>
              index === 0 ||
              index === coordinates.length - 1 ||
              index % Math.ceil(coordinates.length / 20) === 0
          );

          // Pobierz trasę z API Mapbox
          const coordsString = simplifiedCoordinates.map((coord) => coord.join(",")).join(";");
          const directionsResponse = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/walking/${coordsString}?geometries=geojson&access_token=${process.env.PUBLIC_MAPBOX_ACCESS_TOKEN}`
          );
          const directionsData = await directionsResponse.json();
          const routeCoordinates = directionsData.routes[0].geometry.coordinates;

          // Oblicz granice i środek mapy
          const bounds = routeCoordinates.reduce(
            (acc, coord) => ({
              minLng: Math.min(acc.minLng, coord[0]),
              maxLng: Math.max(acc.maxLng, coord[0]),
              minLat: Math.min(acc.minLat, coord[1]),
              maxLat: Math.max(acc.maxLat, coord[1]),
            }),
            {
              minLng: routeCoordinates[0][0],
              maxLng: routeCoordinates[0][0],
              minLat: routeCoordinates[0][1],
              maxLat: routeCoordinates[0][1],
            }
          );

          const center = {
            lng: (bounds.minLng + bounds.maxLng) / 2,
            lat: (bounds.minLat + bounds.maxLat) / 2,
          };

          // Oblicz zoom
          const latDiff = bounds.maxLat - bounds.minLat;
          const lngDiff = bounds.maxLng - bounds.minLng;
          const maxDiff = Math.max(latDiff, lngDiff);
          const zoom = Math.min(
            14,
            Math.max(9, Math.floor(11 - Math.log2(maxDiff * 111)))
          );

          // Wygeneruj URL mapy statycznej
          const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/static/geojson(%7B%22type%22%3A%22Feature%22%2C%22properties%22%3A%7B%22stroke%22%3A%22%23ff0000%22%2C%22stroke-width%22%3A2%7D%2C%22geometry%22%3A%7B%22type%22%3A%22LineString%22%2C%22coordinates%22%3A${JSON.stringify(
            routeCoordinates
          )}%7D%7D)/${center.lng},${center.lat},${zoom}/600x300@2x?access_token=${process.env.PUBLIC_MAPBOX_ACCESS_TOKEN}`;

          setStaticMapUrl(mapUrl);
    } catch (error) {
          console.error("Error creating static map:", error);
        }
      }
    };

    generateStaticMap();
  }, [trailData]);

  // Przygotuj tablicę wszystkich zdjęć (mapa + zdjęcia z activity)
  const allImages = useMemo(() => {
    const images = [];
    if (staticMapUrl) {
      images.push(staticMapUrl);
    }
    if (activity.picturesNames && activity.picturesNames.length > 0) {
      const postImages = activity.picturesNames.map(pictureName => 
        `${REACT_APP_CLOUDFRONT_DOMAIN_NAME_POSTS}${pictureName}`
      );
      images.push(...postImages);
    }
    return images;
  }, [staticMapUrl, activity.picturesNames]);

  const imageWidth = width - 32; // szerokość zdjęcia (szerokość ekranu - padding)

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const imageIndex = Math.round(contentOffset / imageWidth);
    setCurrentImageIndex(imageIndex);
  };

  return (
    <View className="bg-white rounded-xl shadow-md mb-4 overflow-hidden">
      <View className="p-4">
        <View className="flex-row items-center mb-3">
          <Image
            source={{ uri: getAvatarUrl(activity.ownerId) }}
            className="w-10 h-10 rounded-full"
          />
          <View className="ml-3">
            <Text className="font-bold text-dark">
              {activity.ownerFullName}
            </Text>
            <Text className="text-gray-500 text-sm">{formattedDate}</Text>
          </View>
        </View>

        <Text className="text-lg font-semibold mb-2">{activity.title}</Text>
        
        {activity.description && (
          <Text className="text-gray-600 mb-3">{activity.description}</Text>
        )}

        {allImages.length > 0 && (
          <View className="mb-3">
            <View className="overflow-hidden rounded-lg">
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                decelerationRate="fast"
                snapToInterval={imageWidth}
                snapToAlignment="center"
                style={{ width: imageWidth }}
                contentContainerStyle={{
                  height: 200
                }}
              >
                {allImages.map((imageUrl, index) => (
                  <View 
                    key={index} 
                    style={{ 
                      width: imageWidth,
                    }}
                  >
                    <Image
                      source={{ uri: imageUrl }}
                      style={{ 
                        width: imageWidth,
                        height: 200,
                        borderRadius: 8
                      }}
                      resizeMode="cover"
                    />
                  </View>
                ))}
              </ScrollView>
            </View>

            {allImages.length > 1 && (
              <View className="flex-row justify-center mt-2">
                {allImages.map((_, index) => (
                  <View
                    key={index}
                    className={`h-2 w-2 rounded-full mx-1 ${
                      currentImageIndex === index ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity 
              onPress={handleLike}
              className="flex-row items-center gap-1"
            >
              {isLikedByUser ? (
                <HeartIcon width={20} height={20} fill="#ef4444" />
              ) : (
                <HeartOutlineIcon width={20} height={20} fill="#6b7280" />
              )}
              <Text className="text-gray-500">
                {activity.likes.length}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setShowCommentInput(!showCommentInput)}
              className="flex-row items-center gap-1"
            >
              <CommentIcon width={20} height={20} fill="#6b7280" />
              <Text className="text-gray-500">
                {activity.comments.length}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {showCommentInput && (
          <View className="flex-row items-center gap-2 mt-2">
            <TextInput
              className="flex-1 bg-gray-100 rounded-lg px-3 py-2"
              placeholder="Dodaj komentarz..."
              value={commentContent}
              onChangeText={setCommentContent}
            />
            <TouchableOpacity
              onPress={handleComment}
              className="bg-primary px-4 py-2 rounded-lg"
            >
              <Text className="text-white">Wyślij</Text>
            </TouchableOpacity>
          </View>
        )}

        {activity.comments.length > 0 && (
          <View className="mt-3 border-t border-gray-200 pt-3">
            {activity.comments.map(comment => (
              <View key={comment.id} className="mb-2">
                <View className="flex-row items-center">
                  <Image
                    source={{ uri: getAvatarUrl(comment.userId) }}
                    className="w-6 h-6 rounded-full"
                  />
                  <Text className="ml-2 font-bold">
                    {commentUsers[comment.id] || 'Ładowanie...'}
                  </Text>
                </View>
                <Text className="ml-8 text-gray-600">{comment.content}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const Home = () => {
  const [activities, setActivities] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const fetchActivities = async () => {
    try {
      const response = await fetch(`${endpoints.activities}?page=${page}`);
        if (response.ok) {
          const data = await response.json();
        if (data.items) {
          setActivities(data.items);
          setHasNextPage(data.hasNextPage);
        } else {
          console.error('Nieprawidłowa struktura danych:', data);
          setActivities([]);
        }
      } else {
        throw new Error('Nie udało się pobrać aktywności');
      }
    } catch (error) {
      console.error('Błąd podczas pobierania aktywności:', error);
      setAlertMessage(error.message);
      setActivities([]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await fetchActivities();
    setRefreshing(false);
  };

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          const decoded = jwtDecode(token);
          setCurrentUserId(decoded.id);
        }
      } catch (error) {
        console.error('Błąd podczas pobierania ID użytkownika:', error);
      }
    };

    getCurrentUser();
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [page]);

  const handleLike = async (activityId, likeId, action) => {
    try {
      if (action === 'like') {
        await fetch(endpoints.activityLikes(activityId), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(currentUserId),
        });
      } else {
        await fetch(endpoints.deleteLike(likeId), {
          method: 'DELETE',
        });
      }
      await fetchActivities();
    } catch (error) {
      console.error('Błąd podczas lajkowania:', error);
      setAlertMessage('Nie udało się wykonać akcji');
    }
  };

  const handleComment = async (activityId, content) => {
    try {
      await fetch(endpoints.activityComments(activityId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUserId,
          content: content
        }),
      });
      await fetchActivities();
    } catch (error) {
      setAlertMessage('Nie udało się dodać komentarza');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-light">
      {alertMessage && (
        <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />
      )}
      
      <ScrollView 
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text className="text-2xl font-bold text-dark my-4">
          Aktywności
          </Text>

        {Array.isArray(activities) && activities.length > 0 ? (
          activities.map((activity) => (
            <ActivityPost 
              key={activity.id} 
              activity={activity}
              onLike={handleLike}
              onComment={handleComment}
              currentUserId={currentUserId}
            />
          ))
        ) : (
          <View className="items-center justify-center py-8">
            <Text className="text-gray-500">Brak aktywności do wyświetlenia</Text>
                  </View>
                )}

        {hasNextPage && (
                  <TouchableOpacity
            className="bg-primary py-2 px-4 rounded-lg mb-4"
            onPress={() => setPage(prev => prev + 1)}
                  >
            <Text className="text-white text-center">Załaduj więcej</Text>
                  </TouchableOpacity>
                )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

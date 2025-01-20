import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import Alert from '../utils/Alert';

const Home = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(null);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://10.0.2.2:5253/api/posts');
      if (!response.ok) {
        throw new Error('Nie udało się pobrać postów');
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Błąd podczas pobierania postów:', error);
      setAlertMessage('Nie udało się pobrać postów');
    }
  };

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        const decoded = jwtDecode(token);
        const userId = decoded.id;
        const response = await fetch(`http://10.0.2.2:5253/api/users/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        }
      }
    } catch (error) {
      console.error('Błąd podczas pobierania danych użytkownika:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchPosts(), fetchUserData()]);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchPosts();
    fetchUserData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-light">
      {alertMessage && <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />}
      
      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="p-4 bg-primary">
          <Text className="text-white text-2xl font-bold">
            Witaj, {userData ? userData.firstName : 'Użytkowniku'}!
          </Text>
          <Text className="text-white/80 mt-1">
            Co nowego w TrailMates?
          </Text>
        </View>

        <View className="p-4">
          {posts.map((post) => (
            <View 
              key={post.id} 
              className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden"
            >
              {post.imageUrl && (
                <Image
                  source={{ uri: post.imageUrl }}
                  className="w-full h-48"
                  resizeMode="cover"
                />
              )}
              <View className="p-4">
                <Text className="text-xl font-bold text-gray-800">
                  {post.title}
                </Text>
                <Text className="text-gray-500 text-sm mt-1">
                  {formatDate(post.createdAt)}
                </Text>
                <Text className="text-gray-600 mt-2 leading-6">
                  {post.content}
                </Text>
                {post.tags && post.tags.length > 0 && (
                  <View className="flex-row flex-wrap mt-3">
                    {post.tags.map((tag, index) => (
                      <View 
                        key={index}
                        className="bg-primary/10 px-3 py-1 rounded-full mr-2 mb-2"
                      >
                        <Text className="text-primary text-sm">
                          {tag}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
                {post.linkUrl && (
                  <TouchableOpacity
                    className="mt-3 bg-primary px-4 py-2 rounded-lg self-start"
                    onPress={() => {/* Obsługa linku */}}
                  >
                    <Text className="text-white font-medium">
                      Dowiedz się więcej
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

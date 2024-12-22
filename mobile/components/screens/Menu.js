import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Menu = ({ navigation }) => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        
        if (token) {
          const decoded = jwtDecode(token);
          console.log('Decoded Token:', decoded);
          
          if (decoded && decoded.unique_name) {
            setUserName(decoded.unique_name);
          }
        } else {
          console.log('Token nie znaleziony!');
        }
      } catch (error) {
        console.error('Błąd podczas odczytywania tokenu:', error);
      }
    };
    loadUserData();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-light">
      <View className="flex-1 items-center pt-6 px-4 m-4">
        <View className="w-full mb-6 flex-row items-center justify-between">
          <View className="bg-white p-4 w-full h-40 flex-row justify-start items-center rounded-lg shadow-lg">
            <TouchableOpacity
              onPress={() => navigation.navigate('UserProfile')}
              className="mr-4"
            >
              <Image
                source={{
                  uri: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541',
                }}
                className="w-[33%] h-full rounded-full aspect-square"
              />
            </TouchableOpacity>
            <View className="flex-1 ml-4">
              <Text className="text-dark text-lg font-bold">Witaj, {userName || 'Gość'}</Text>
              <Text className="text-dark text-sm mt-2">cos tu bedzie jakis opis moze staty</Text>
            </View>
          </View>
        </View>


        <Text className="text-2xl font-bold text-center mb-6">MENU</Text>
        <View className="w-full flex-row flex-wrap justify-between items-center gap-4">
          <TouchableOpacity
            className="bg-white rounded-lg w-full h-20 flex justify-center items-center shadow-lg"
            onPress={() => alert('Pierwszy przycisk')}
          >
            <Text className="text-dark text-center font-bold">Moje aktywności?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-white rounded-lg w-full h-20 flex justify-center items-center shadow-lg"
            onPress={() => alert('Drugi przycisk')}
          >
            <Text className="text-dark text-center font-bold">Osiągnięcia?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-white rounded-lg w-full h-20 flex justify-center items-center shadow-lg"
            onPress={() => alert('Trzeci przycisk')}
          >
            <Text className="text-dark text-center font-bold">cośtam</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-white rounded-lg w-full h-20 flex justify-center items-center shadow-lg"
            onPress={() => alert('Czwarty przycisk')}
          >
            <Text className="text-dark text-center font-bold">nwm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-white rounded-lg w-full h-20 flex justify-center items-center shadow-lg"
            onPress={() => alert('Czwarty przycisk')}
          >
            <Text className="text-dark text-center font-bold">o nas?</Text>
          </TouchableOpacity>
          
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Menu;

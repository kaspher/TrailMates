import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LongLogo from '../../assets/longlogo.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Splash = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const checkAuthToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          console.log('Token znaleziony:', token);
          // add some other validation
          navigation.replace('MainTabs');
        } else {
          console.log('Nie znaleziono tokenu, przekierowanie do Login.');
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('Error przy sprawdzaniu tokenu:', error);
        navigation.replace('Login');
      }
    };

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      checkAuthToken();
    }, 1000);

    return () => clearTimeout(timer);
  }, [fadeAnim, navigation]);

  return (
    <SafeAreaView className="flex-1 bg-secondary justify-center items-center">
      <Animated.View style={{ opacity: fadeAnim }}>
        <LongLogo width={250} height={50} />
      </Animated.View>
    </SafeAreaView>
  );
};

export default Splash;

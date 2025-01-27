import 'react-native-gesture-handler';
import './src/assets/global.css';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Font from 'expo-font';
import { jwtDecode } from 'jwt-decode';
import { View, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Menu from './src/screens/Menu';
import Trails from './src/screens/Trails';
import Activities from './src/screens/Activities';
import RecordedTrails from './src/screens/RecordedTrails';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import Settings from './src/screens/Settings';
import TabNavigator from './src/utils/TabNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Poppins-Bold': require('./src/assets/fonts/Poppins-Bold.ttf'),
        'Poppins-Light': require('./src/assets/fonts/Poppins-Light.ttf'),
        'Poppins-Regular': require('./src/assets/fonts/Poppins-Regular.ttf'),
        'Test-Font-Delete': require('./src/assets/fonts/Test-Font-Delete.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
    checkAuthToken();
  }, []);

  const checkAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decodedToken.exp > currentTime) {
          setIsAuthenticated(true);
        } else {
          await AsyncStorage.removeItem('authToken');
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error('Błąd podczas sprawdzania tokenu:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!fontsLoaded || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#386641" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar
          translucent={true}
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right'
            }}
            initialRouteName={isAuthenticated ? 'MainTabs' : 'Login'}
          >
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="Menu" component={Menu} />
            <Stack.Screen name="Trails" component={Trails} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="Activities" component={Activities} />
            <Stack.Screen name="RecordedTrails" component={RecordedTrails} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

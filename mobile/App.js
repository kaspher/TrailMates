import 'react-native-gesture-handler';
import './assets/global.css';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Font from 'expo-font';
import { View, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Login from './components/screens/Login';
import Register from './components/screens/Register';
import TabNavigator from './components/trailUtils/TabNavigator';
import ForgotPassword from './components/screens/ForgotPassword';
import Splash from './components/screens/Splash';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Settings from './components/screens/Settings';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
        'Poppins-Light': require('./assets/fonts/Poppins-Light.ttf'),
        'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
        // do usunięcia, font do testowania czy poppins działa bo jest łudząco podobny do domyślnego
        'Test-Font-Delete': require('./assets/fonts/Test-Font-Delete.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
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
          <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="MainTabs" component={TabNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

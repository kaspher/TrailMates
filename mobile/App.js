import './assets/global.css';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Font from 'expo-font';
import Splash from './components/screens/Splash';
import Login from './components/screens/Login';
import Register from './components/screens/Register';
import ForgotPassword from './components/screens/ForgotPassword';
import TabNavigator from './components/utils/TabNavigator';
import UserProfile from './components/screens/UserProfile';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const loadFonts = async () => {
  await Font.loadAsync({
    'Poppins_Light': require('./assets/fonts/Poppins-Light.ttf'),
    'Poppins_Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins_Bold': require('./assets/fonts/Poppins-Bold.ttf'),
    'Test_Font_Delete': require('./assets/fonts/Test-Font-Delete.ttf'),
  });
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) {
    return <Splash/>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="UserProfile" component={UserProfile} />
        <Stack.Screen name="MainTabs" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

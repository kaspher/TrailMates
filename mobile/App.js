import './assets/global.css';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './components/screens/Login';
import Register from './components/screens/Register';
import MapboxGL from '@rnmapbox/maps';
import {PUBLIC_MAPBOX_ACCESS_TOKEN} from '@env';
import TabNavigator from './components/utils/TabNavigator';
import ForgotPassword from './components/screens/ForgotPassword';
import Splash from './components/screens/Splash';
import UserProfile from './components/screens/UserProfile';

const Stack = createNativeStackNavigator();

MapboxGL.setAccessToken(PUBLIC_MAPBOX_ACCESS_TOKEN);


export default function App() {
  console.log(PUBLIC_MAPBOX_ACCESS_TOKEN)
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" options={{ headerShown: false }} >
        <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }}/>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }}/>
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }}/>
        <Stack.Screen name="UserProfile" component={UserProfile} />
        <Stack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

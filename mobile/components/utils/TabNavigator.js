import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import Trails from '../screens/Trails';
import Menu from '../screens/Menu';
import UserProfile from '../screens/UserProfile';
import HomeIcon from '../../assets/icons/house-solid.svg';
import MapIcon from '../../assets/icons/map-solid.svg';
import MenuIcon from '../../assets/icons/bars-solid.svg';
import Activities from '../screens/Activities';

const Tab = createBottomTabNavigator();
const MenuStack = createNativeStackNavigator();

// Stwórz osobny stack dla Menu i UserProfile
const MenuStackScreen = () => {
  return (
    <MenuStack.Navigator screenOptions={{ headerShown: false }}>
      <MenuStack.Screen name="MenuMain" component={Menu} />
      <MenuStack.Screen name="UserProfile" component={UserProfile} />
      <MenuStack.Screen name="Activities" component={Activities} />
    </MenuStack.Navigator>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
        },
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Home') {
            return <HomeIcon width={size} height={size} fill={color} />;
          } else if (route.name === 'Trails') {
            return <MapIcon width={size} height={size} fill={color} />;
          } else if (route.name === 'Menu') {
            return <MenuIcon width={size} height={size} fill={color} />;
          }
        },
        tabBarActiveTintColor: '#f2faf4',
        tabBarActiveBackgroundColor: '#386641',
        tabBarInactiveTintColor: '#386641',
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Trails" component={Trails} />
      <Tab.Screen name="Menu" component={MenuStackScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;

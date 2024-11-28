import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home'
import Maps from '../screens/Maps';
import UserProfile from '../screens/UserProfile';
import UserIcon from '../../assets/icons/user-solid.svg'
import MapsIcon from '../../assets/icons/map-solid.svg'
import HomeIcon from '../../assets/icons/house-solid.svg'

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
        },
        tabBarActiveTintColor: '#f2faf4',
        tabBarActiveBackgroundColor: '#386641',
        tabBarInactiveTintColor: '#386641',
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={Home}
        options={{
            tabBarIcon: ({ color, size}) => (
                <HomeIcon width={size} height={size} fill={color} />
            ),
        }}
      />
      <Tab.Screen 
        name="Maps" 
        component={Maps}
        options={{
            tabBarIcon: ({ color, size}) => (
                <MapsIcon width={size} height={size} fill={color} />
            ),
        }}
      />
      <Tab.Screen
        name="UserProfile"
        component={UserProfile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <UserIcon width={size} height={size} fill={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;

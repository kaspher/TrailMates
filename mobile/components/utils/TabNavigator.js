import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home'
import Trails from '../screens/Trails';
import MenuIcon from '../../assets/icons/bars-solid.svg'
import MapsIcon from '../../assets/icons/map-solid.svg'
import HomeIcon from '../../assets/icons/house-solid.svg'
import Menu from '../screens/Menu';

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
        name="Trails" 
        component={Trails}
        options={{
            tabBarIcon: ({ color, size}) => (
                <MapsIcon width={size} height={size} fill={color} />
            ),
        }}
      />
      <Tab.Screen
        name="Menu"
        component={Menu}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MenuIcon width={size} height={size} fill={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;

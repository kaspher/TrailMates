import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../../src/screens/Home';
import Trails from '../../src/screens/Trails';
import Menu from '../../src/screens/Menu';
import UserProfile from '../../src/screens/UserProfile';
import Activities from '../../src/screens/Activities';
import RecordedTrails from '../../src/screens/RecordedTrails';
import HomeIcon from '../../src/assets/icons/house-solid.svg';
import MapIcon from '../../src/assets/icons/map-solid.svg';
import MenuIcon from '../../src/assets/icons/bars-solid.svg';

const Tab = createBottomTabNavigator();
const MenuStack = createNativeStackNavigator();

const MenuStackScreen = () => {
  return (
    <MenuStack.Navigator screenOptions={{ headerShown: false }}>
      <MenuStack.Screen name="MenuMain" component={Menu} />
      <MenuStack.Screen name="UserProfile" component={UserProfile} />
      <MenuStack.Screen name="Activities" component={Activities} />
      <MenuStack.Screen name="RecordedTrails" component={RecordedTrails} />
    </MenuStack.Navigator>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ _, color, size }) => {
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

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Linking, 
  Platform,
  PermissionsAndroid 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GoBackArrow from '../utils/GoBackArrow';
import LocationIcon from '../../src/assets/icons/location-arrow-solid.svg';
import BellIcon from '../../src/assets/icons/route-solid.svg';

const Settings = () => {
  const [permissions, setPermissions] = useState({
    location: false,
    backgroundLocation: false,
    notifications: false
  });

  const checkPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const locationPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        
        const backgroundLocationPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
        );

        let notificationPermission = false;
        if (Platform.Version >= 33) {
          notificationPermission = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
        }

        setPermissions({
          location: locationPermission,
          backgroundLocation: backgroundLocationPermission,
          notifications: notificationPermission
        });
      } catch (err) {
        console.warn(err);
      }
    }
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  const openAppSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  const renderPermissionItem = (title, description, isGranted, icon) => (
    <TouchableOpacity
      onPress={openAppSettings}
      className="bg-white p-4 rounded-xl mb-4 shadow-sm"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
            {icon}
          </View>
          <View className="flex-1">
            <Text className="text-lg font-medium">{title}</Text>
            <Text className="text-gray-500 text-sm mt-1">{description}</Text>
          </View>
        </View>
        <View className={`px-3 py-1 rounded-full ${
          isGranted ? 'bg-green-100' : 'bg-red-100'
        }`}>
          <Text className={`${
            isGranted ? 'text-green-700' : 'text-red-700'
          }`}>
            {isGranted ? 'Włączone' : 'Wyłączone'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView edges={['right', 'left', 'bottom']} className="flex-1 bg-light">
      <GoBackArrow title="Ustawienia" />
      
      <View className="flex-1 p-4">
        <Text className="text-lg font-bold mb-4">Uprawnienia aplikacji</Text>
        
        {renderPermissionItem(
          'Lokalizacja',
          'Dostęp do lokalizacji urządzenia',
          permissions.location,
          <LocationIcon width={20} height={20} fill="#386641" />
        )}

        {renderPermissionItem(
          'Lokalizacja w tle',
          'Dostęp do lokalizacji gdy aplikacja działa w tle',
          permissions.backgroundLocation,
          <LocationIcon width={20} height={20} fill="#386641" />
        )}

        {renderPermissionItem(
          'Powiadomienia',
          'Możliwość wysyłania powiadomień',
          permissions.notifications,
          <BellIcon width={20} height={20} fill="#386641" />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Settings; 
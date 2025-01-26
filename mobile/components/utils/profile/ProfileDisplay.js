import React from 'react';
import { View, Text } from 'react-native';

const ProfileDisplay = ({ userData }) => {
  const fields = [
    { key: 'firstName', label: 'Imię' },
    { key: 'lastName', label: 'Nazwisko' },
    { key: 'email', label: 'Email' },
    { key: 'gender', label: 'Płeć' },
    { key: 'country', label: 'Kraj' },
    { key: 'city', label: 'Miasto' },
  ];

  return (
    <>
      {fields.map(({ key, label }, index) => (
        <View 
          key={key} 
          className={`${index !== fields.length - 1 ? 'border-b border-gray-200' : ''} py-3`}
        >
          <Text className="text-gray-600">{label}</Text>
          <Text className="text-black font-medium">{userData?.[key] || 'Brak danych'}</Text>
        </View>
      ))}
    </>
  );
};

export default ProfileDisplay; 
import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

const ProfileEditForm = ({ formData, setFormData, onSave, onCancel }) => {
  const fields = [
    { key: 'firstName', label: 'Imię' },
    { key: 'lastName', label: 'Nazwisko' },
    { key: 'gender', label: 'Płeć' },
    { key: 'country', label: 'Kraj' },
    { key: 'city', label: 'Miasto' },
  ];

  return (
    <>
      {fields.map(({ key, label }) => (
        <View key={key} className="mb-4">
          <Text className="text-gray-600 mb-1">{label}</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-2"
            value={formData[key]}
            onChangeText={(text) => setFormData(prev => ({...prev, [key]: text}))}
          />
        </View>
      ))}
      <View className="flex-row justify-end space-x-4">
        <TouchableOpacity
          onPress={onCancel}
          className="bg-gray-300 px-4 py-2 rounded-lg"
        >
          <Text>Anuluj</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onSave}
          className="bg-primary px-4 py-2 rounded-lg"
        >
          <Text className="text-white">Zapisz</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default ProfileEditForm; 
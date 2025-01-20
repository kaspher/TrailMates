import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import LocationIcon from '../../assets/icons/location-arrow-solid.svg';
import LayerIcon from '../../assets/icons/layer-group-solid.svg';

const MapControls = ({ 
  onCenterPress, 
  onStylePress, 
  onNorthPress,
  mapStyle 
}) => {
  return (
    <View className="absolute top-32 right-1">
      <TouchableOpacity
        className="bg-white p-3 rounded-full shadow-md mb-3"
        onPress={onCenterPress}
      >
        <LocationIcon width={24} height={24} fill="#386641" />
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-white p-3 rounded-full shadow-md mb-3"
        onPress={onStylePress}
      >
        <LayerIcon width={24} height={24} fill="#386641" />
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-white w-12 h-12 rounded-full shadow-md items-center justify-center"
        onPress={onNorthPress}
      >
        <Text className="font-bold text-primary text-lg">N</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MapControls;
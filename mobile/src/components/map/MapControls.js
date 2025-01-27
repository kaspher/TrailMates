import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import LocationIcon from '../../../src/assets/icons/location-crosshairs-solid.svg';
import LayersIcon from '../../../src/assets/icons/layer-group-solid.svg';

const MapControls = ({ 
  onLocationPress, 
  onLayerPress,
  isFollowingUser
}) => {
  return (
    <View className="absolute right-4 top-36 bg-transparent">
      <TouchableOpacity
        onPress={onLocationPress}
        className={`w-11 h-11 rounded-full justify-center items-center mb-2 shadow-lg ${
          isFollowingUser ? 'bg-primary' : 'bg-white'
        }`}
      >
        <LocationIcon 
          width={20} 
          height={20} 
          fill={isFollowingUser ? "#fff" : "#386641"} 
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onLayerPress}
        className="w-11 h-11 bg-white rounded-full justify-center items-center mb-2 shadow-lg"
      >
        <LayersIcon width={20} height={20} fill="#386641" />
      </TouchableOpacity>
    </View>
  );
};

export default MapControls;
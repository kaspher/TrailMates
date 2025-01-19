import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PlayIcon from '../../assets/icons/circle-play-solid.svg';
import PauseIcon from '../../assets/icons/circle-pause-solid.svg';

const MapBottomControls = ({ 
  isTracking, 
  onStartTracking, 
  onStopTracking, 
  onHelpPress, 
  onShowNearbyList 
}) => {
  return (
    <View className="bg-white h-16 border-t border-gray-200 relative z-30">
      <View className="h-full px-4 flex-row items-center justify-between">
        <TouchableOpacity
          className="bg-primary/10 w-[125px] h-10 rounded-full flex items-center justify-center z-10"
          onPress={onHelpPress}
        >
          <Text className="text-primary font-medium text-base">
            Pomoc
          </Text>
        </TouchableOpacity>

        <View className="w-[100px]" />
      </View>

      <View className="absolute inset-x-0 -top-14 flex items-center">
        <View className="w-[100px] h-[100px] rounded-full bg-white flex items-center justify-center">
          <TouchableOpacity
            className="bg-primary w-24 h-24 rounded-full flex items-center justify-center"
            onPress={isTracking ? onStopTracking : onStartTracking}
          >
            {isTracking ? (
              <PauseIcon width={40} height={40} fill="#ffffff" />
            ) : (
              <PlayIcon width={40} height={40} fill="#ffffff" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View className="absolute right-4 h-full flex items-center justify-center">
        <TouchableOpacity
          className="bg-primary/10 w-[125px] h-10 rounded-full flex items-center justify-center z-10"
          onPress={onShowNearbyList}
        >
          <Text className="text-primary font-medium text-base">
            Lista tras
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MapBottomControls; 
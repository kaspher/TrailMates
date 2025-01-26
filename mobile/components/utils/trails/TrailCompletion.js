import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue 
} from 'react-native-reanimated';

const TrailCompletion = ({ isVisible, trailName, onClose }) => {
  const translateY = useSharedValue(1000);

  useEffect(() => {
    if (isVisible) {
      translateY.value = withSpring(0);
    } else {
      translateY.value = 1000;
    }
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }]
  }));

  if (!isVisible) return null;

  return (
    <View className="absolute inset-0 bg-black/50">
      <Animated.View 
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6"
        style={animatedStyle}
      >
        <View className="items-center">
          <Text className="text-2xl font-bold text-primary text-center mb-4">
            Pomyślnie ukończono trasę
          </Text>
          <Text className="text-lg text-gray-600 text-center mb-8">
            {trailName}
          </Text>
          <TouchableOpacity
            onPress={onClose}
            className="bg-primary px-12 py-3 rounded-full"
          >
            <Text className="text-white font-bold text-lg">
              OK
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

export default TrailCompletion; 
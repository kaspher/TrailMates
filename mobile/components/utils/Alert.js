import React, { useEffect, useRef } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import CloseButton from '../../assets/icons/x-solid.svg';

const Alert = ({ message, duration = 6000, onClose }) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const progressAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();

    Animated.timing(progressAnim, {
      toValue: 0,
      duration: duration,
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        if (onClose) onClose();
      });
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose, slideAnim, progressAnim]);

  return (
    <Animated.View
      style={{ transform: [{ translateY: slideAnim }] }}
      className="absolute top-10 left-4 right-4 z-50"
    >
      <View className="bg-white rounded-xl shadow-lg overflow-hidden">
        <View className="p-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-800 flex-1 mr-2">{message}</Text>
            <TouchableOpacity onPress={onClose}>
              <CloseButton width={15} height={15} fill="#386641" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Pasek postępu */}
        <View className="h-[4px] bg-gray-200 w-full">
          <Animated.View
            style={{
              width: progressAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            }}
            className="h-full bg-primary"
          />
        </View>
      </View>
    </Animated.View>
  );
};

export default Alert;

import React, { useEffect, useRef } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';

const Alert = ({ message, duration = 3000, onClose }) => {
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
      className="absolute top-0 left-0 right-0 bg-white z-50 flex flex-row items-center justify-between px-4 py-3 rounded-s"
    >
      <Text className="text-black text-lg font-bold flex-1 text-center">{message}</Text>
      <TouchableOpacity onPress={onClose} className="px-2">
        <Text className="text-black text-xl font-bold">X</Text>
      </TouchableOpacity>
      <View className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300">
        <Animated.View
          style={{
            width: progressAnim.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }),
          }}
          className="h-full bg-teal-500"
        />
      </View>
    </Animated.View>
  );
};

export default Alert;

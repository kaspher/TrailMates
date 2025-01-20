import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue,
  runOnJS
} from 'react-native-reanimated';

const TrailShare = ({ 
  isVisible, 
  onClose, 
  onShare,
  trail,
  trailName,
  setTrailName,
  trailType,
  setTrailType 
}) => {
  const translateY = useSharedValue(1000);

  useEffect(() => {
    if (isVisible) {
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 100,
        mass: 1,
        velocity: 0.5
      });
    } else {
      translateY.value = 1000;
    }
  }, [isVisible]);

  const handleClose = () => {
    translateY.value = withSpring(1000, {
      damping: 20,
      stiffness: 100,
      mass: 1,
      velocity: 0.5
    }, (finished) => {
      if (finished) {
        runOnJS(onClose)();
      }
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }]
  }));

  if (!isVisible) return null;

  return (
    <View className="absolute inset-0 bg-black/50">
      <Animated.View 
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg z-40"
        style={[animatedStyle, { maxHeight: '80%' }]}
      >
        <View className="p-4 border-b border-gray-200">
          <View className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-2" />
          <View className="flex-row justify-between items-center">
            <Text className="text-xl font-bold">Udostępnij trasę</Text>
            <TouchableOpacity
              onPress={handleClose}
              className="p-2"
            >
              <Text className="text-gray-500 text-xl">✕</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1 p-4">
          <Text className="text-sm font-medium mb-2">Nazwa trasy</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
            placeholder="Wprowadź nazwę trasy"
            value={trailName}
            onChangeText={setTrailName}
          />

          <Text className="text-sm font-medium mb-2">Typ trasy</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="mb-6"
          >
            {['Pieszy', 'Rowerowy', 'Biegowy'].map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setTrailType(type)}
                className={`mr-2 px-4 py-2 rounded-full ${
                  trailType === type ? 'bg-primary' : 'bg-gray-200'
                }`}
              >
                <Text
                  className={`${
                    trailType === type ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View className="flex-row justify-between items-center mt-4">
            <TouchableOpacity
              onPress={handleClose}
              className="px-6 py-3 rounded-lg bg-gray-500"
            >
              <Text className="text-white font-medium">Anuluj</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onShare(trail.id)}
              className="px-6 py-3 rounded-lg bg-primary"
            >
              <Text className="text-white font-medium">Udostępnij</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
};

export default TrailShare; 
import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ArrowIcon from '../../src/assets/icons/arrow-left-solid.svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const GoBackArrow = ({ title }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View 
      className="bg-white shadow-sm z-50"
      style={{ paddingTop: insets.top }}
    >
      <View 
        className="flex-row items-center px-4"
        style={{ height: 56 }}
      >
        <TouchableOpacity
          className="p-2 rounded-full"
          onPress={() => navigation.goBack()}
        >
          <ArrowIcon width={24} height={24} fill="#386641" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-primary ml-2 flex-1">
          {title}
        </Text>
      </View>
    </View>
  );
};

export default GoBackArrow; 
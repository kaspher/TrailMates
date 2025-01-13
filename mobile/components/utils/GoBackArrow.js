import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ArrowIcon from '../../assets/icons/arrow-left-solid.svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const GoBackArrow = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <TouchableOpacity
      className="absolute left-4 bg-white p-2 rounded-full shadow-md z-50"
      style={{ top: insets.top + 12 }}
      onPress={() => navigation.goBack()}
    >
      <ArrowIcon width={24} height={24} fill="#386641" />
    </TouchableOpacity>
  );
};

export default GoBackArrow; 
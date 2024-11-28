import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DevList = ({ screens }) => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => setModalVisible(!isModalVisible);

  const navigateToScreen = (screen) => {
    navigation.navigate(screen);
    toggleModal();
  };

  return (
    <View>
      <TouchableOpacity
        onPress={toggleModal}
        className="bg-gray-800 px-4 py-2 rounded-md self-start"
      >
        <Text className="text-white font-bold text-sm">DevList</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <View className="flex-1 bg-black bg-opacity-50 justify-start pt-10">
          <View className="bg-white w-full p-4 rounded-b-lg">
            <Text className="text-lg font-bold mb-4 text-center">Dostępne Ekrany</Text>
            <FlatList
              data={screens}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => navigateToScreen(item)}
                  className="bg-gray-200 p-3 rounded-md mb-2"
                >
                  <Text className="text-black text-center font-semibold">{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={toggleModal}
              className="bg-red-500 px-4 py-2 rounded-md mt-4"
            >
              <Text className="text-white text-center font-bold">Zamknij</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DevList;

// USUNAC PRZED PUBLIKACJA CALY PLIK !!! NARUSZA BEZPIECZENSTWO
import React, { useState } from 'react';
import { Modal, FlatList, TouchableOpacity, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DevList = ({ screens }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const toggleModal = () => setModalVisible(!isModalVisible);

  const navigateToScreen = (screen) => {
    if (['Home', 'UserProfile', 'Trails', 'Menu'].includes(screen)) {
      navigation.navigate('MainTabs', { screen });
    } else {
      navigation.navigate(screen);
    }
    toggleModal();
  };

  return (
    <View>
      <TouchableOpacity
        onPress={toggleModal}
        className="bg-gray-800 px-4 py-2 rounded-md"
      >
        <Text className="text-white font-bold text-sm text-center">LISTA EKRANÓW</Text>
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

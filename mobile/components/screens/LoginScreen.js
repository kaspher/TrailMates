import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LongLogo from "../../assets/longlogo.svg";
import Alert from '../Alert';

const LoginScreen = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [screens, setScreens] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    // vvv wczytywanie ekranów do usunięcia przed publikacją vvv
    const loadScreens = () => {
      const screenModules = require
        .context('../../components/screens', true, /\.js$/)
        .keys();

      const screenNames = screenModules.map((file) =>
        file.replace('./', '').replace('.js', '')
      );
      setScreens(screenNames);
    };

    loadScreens();
  }, []);

  const toggleModal = () => setModalVisible(!isModalVisible);

  const navigateToScreen = (screen) => {
    navigation.navigate(screen);
    toggleModal();
  };

  const validateInputs = () => {
    const { email, password } = formData;

    if (!email || !password) {
      setAlertMessage('Wszystkie pola są wymagane!');
      return false;
    }

    if (!email.includes('@')) {
      setAlertMessage('Niepoprawny adres e-mail!');
      return false;
    }

    if (password.length < 6) {
      setAlertMessage('Hasło musi mieć co najmniej 6 znaków!');
      return false;
    }

    setAlertMessage('Logowanie udane!');
    return true;
  };

  return (
    <SafeAreaView className="flex-1 h-screen w-screen bg-secondary">
      <View className="flex-1 justify-center items-center m-3">
        <View className="items-center border-solid mb-8">
          <LongLogo width={250} height={50} />
        </View>
        {alertMessage && <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />}
        <View className="w-4/5 bg-white p-6 rounded-lg">
          <TextInput
            className="border border-gray-300 rounded-md p-3 mb-4 font-regular text-dark"
            placeholder="Adres e-mail"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
          />
          <TextInput
            className="border border-gray-300 rounded-md p-3 mb-4 font-regular text-dark"
            placeholder="Hasło"
            secureTextEntry
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
          />
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text className="text-blue-500 text-right mb-4 font-light">Zapomniałeś hasła?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={validateInputs}
            className="bg-primary p-4 rounded-md"
          >
            <Text className="text-white text-center font-bold">ZALOGUJ SIĘ</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-center items-center mt-6 font-regular">
          <Text className="text-white">Nie posiadasz konta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
            <Text className="text-green-300">Zarejestruj się</Text>
          </TouchableOpacity>
        </View>
        {/* vvv wczytywanie ekranów do usunięcia przed publikacją vvv*/}
        <View className="flex-row justify-center items-center mt-6">
          <TouchableOpacity
            onPress={toggleModal}
            className="bg-gray-800 px-4 py-2 rounded-md self-start"
          >
            <Text className="text-white font-bold text-sm">DEV: EKRANY</Text>
          </TouchableOpacity>
        </View>
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
        {/* ^^^ wczytywanie ekranów do usunięcia przed publikacją ^^^ */}
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

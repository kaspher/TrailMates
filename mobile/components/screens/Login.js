import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LongLogo from "../../assets/longlogo.svg";
import Alert from '../utils/Alert';
import { validateLoginInputs } from '../utils/Validator';
import DevList from '../DevList';

const LoginScreen = ({ navigation }) => {
  const [alertMessage, setAlertMessage] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [screens, setScreens] = useState([]);

  useEffect(() => {
    //NIZEJDO USUNIECIA PRZED PUBLIKACJA (WCZYTYWANIE LISTY WSZYSTKICH EKRANÓW W ŚCIEŻCE ../../components/screens)
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
  // WYZEJ DO USUNIECIA PRZED PUBLIKACJA

  const handleLogin = () => {
    if (validateLoginInputs(formData.email, formData.password, setAlertMessage)) {
      console.log("Zalogowano pomyślnie:", formData);
      navigation.navigate('MainTabs');
    }
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
            onPress={handleLogin}
            className="bg-primary p-4 rounded-md"
          >
            <Text className="text-white text-center font-bold">ZALOGUJ SIĘ</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-center items-center mt-6 font-regular">
          <Text className="text-white">Nie posiadasz konta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text className="text-green-300">Zarejestruj się</Text>
          </TouchableOpacity>
        </View>

        {/* DO USUNIECIA PRZED PUBLIKACJA */}
        <View className="mt-4 bg-primary border">
          <Text className="text-center font-bold text-white m-3 w-screen">PANEL DEVELOPERA</Text>
            <DevList screens={screens} />
            <Text className="m-3 text-white text-center font-bold">dane logowania:</Text>
            <Text className="text-white text-center">admin@admin.com</Text>
            <Text className="text-white text-center">pass: admin</Text>
        </View>
        {/* DO USUNIECIA PRZED PUBLIKACJA */}
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

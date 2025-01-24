import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LongLogo from "../../assets/longlogo.svg";
import Alert from '../utils/Alert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { endpoints } from '../../config';

const LoginScreen = ({ navigation }) => {
  const [alertMessage, setAlertMessage] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async () => {
    try {
      const response = await fetch(`${endpoints.auth.login.replace('auth', 'account')}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Zalogowano pomyślnie:", data);
        await AsyncStorage.setItem('authToken', data);
        navigation.navigate('MainTabs');
      } else {
        setAlertMessage(data.message || 'Nie udało się zalogować. Spróbuj ponownie.');
      }
    } catch (error) {
      console.error("Błąd podczas logowania:", error);
      setAlertMessage('Wystąpił błąd podczas logowania. Sprawdź połączenie i spróbuj ponownie.');
    }
  };

  return (
    <SafeAreaView className="flex-1 h-screen w-screen bg-secondary">
      <View className="flex-1 justify-center items-center m-3">
        <View className="items-center border-solid mb-8">
          <LongLogo width={250} height={50} />
        </View>

        {alertMessage && (
          <Alert 
            message={alertMessage} 
            onClose={() => setAlertMessage(null)} 
            isAuthScreen={true}
          />
        )}

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
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

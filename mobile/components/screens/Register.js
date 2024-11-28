import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Alert from '../utils/Alert';
import LongLogo from "../../assets/longlogo.svg";
import { validateRegisterInputs } from '../utils/Validator';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [alertMessage, setAlertMessage] = useState(null);

  const handleRegister = () => {
    if (validateRegisterInputs(formData, setAlertMessage)) {
      console.log("Rejestracja udana:", formData);
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
            className="border border-gray-300 rounded-md p-3 mb-4 font-regular"
            placeholder="Imię"
            value={formData.firstName}
            onChangeText={(text) => setFormData({ ...formData, firstName: text })}
          />
          <TextInput
            className="border border-gray-300 rounded-md p-3 mb-4 font-regular"
            placeholder="Nazwisko"
            value={formData.lastName}
            onChangeText={(text) => setFormData({ ...formData, lastName: text })}
          />
          <TextInput
            className="border border-gray-300 rounded-md p-3 mb-4 font-regular"
            placeholder="Adres e-mail"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
          />
          <TextInput
            className="border border-gray-300 rounded-md p-3 mb-4 font-regular"
            placeholder="Hasło"
            secureTextEntry
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
          />
          <TextInput
            className="border border-gray-300 rounded-md p-3 mb-4 font-regular"
            placeholder="Powtórz hasło"
            secureTextEntry
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
          />
          <TouchableOpacity onPress={handleRegister} className="bg-primary p-4 rounded-md">
            <Text className="text-white text-center font-bold">ZAREJESTRUJ SIĘ</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center items-center mt-6">
          <Text className="text-white font-regular">Posiadasz już konto? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text className="text-green-300 font-regular">Zaloguj się</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;

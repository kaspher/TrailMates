import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Alert from '../utils/Alert';
import LongLogo from "../../assets/longlogo.svg";
import { validateResetEmail } from '../utils/Validator';

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [alertMessage, setAlertMessage] = useState(null);

  const handlePasswordReset = () => {
    validateResetEmail(email, setAlertMessage);
  };

  return (
    <SafeAreaView className="flex-1 h-screen w-screen bg-secondary">
      <View className="flex-1 justify-center items-center m-3">
        <View className="items-center border-solid mb-8">
          <LongLogo width={250} height={50} />
        </View>

        {alertMessage && <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />}

        <View className="w-4/5 bg-white p-6 rounded-lg">
          <Text className="text-lg text-center mb-4 font-regular">Resetowanie hasła</Text>

          <TextInput
            className="border border-gray-300 rounded-md p-3 mb-4 font-regular"
            placeholder="Adres e-mail"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TouchableOpacity onPress={handlePasswordReset} className="bg-primary p-4 rounded-md mb-4">
            <Text className="text-white text-center font-bold">Resetuj hasło</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()} className="mt-4">
            <Text className="text-blue-500 text-center font-regular">Powrót do logowania</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;

import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LongLogo from "../../assets/longlogo.svg";

const LoginScreen = () => {
  return (
    <SafeAreaView className="flex-1 h-screen w-screen bg-secondary">
      <View className="flex-1 justify-center items-center m-3">
        <View className="items-center border-solid mb-8">
          <LongLogo width={250} height={50} />
        </View>
        <View className="w-4/5 bg-white p-6 rounded-lg">
          <TextInput
            className="border border-gray-300 rounded-md p-3 mb-4"
            placeholder="Adres e-mail"
            keyboardType="email-address"
          />
          <TextInput
            className="border border-gray-300 rounded-md p-3 mb-4"
            placeholder="Hasło"
            secureTextEntry
          />
          <TouchableOpacity>
            <Text className="text-blue-500 text-right mb-4">Zapomniałeś hasła?</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-primary p-4 rounded-md">
            <Text className="text-white text-center font-bold">ZALOGUJ SIĘ</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-center items-center mt-6">
          <Text className="text-white">Nie posiadasz konta? </Text>
          <TouchableOpacity>
            <Text className="text-green-300 font-bold">Zarejestruj się</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

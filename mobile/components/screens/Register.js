import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Alert from '../utils/Alert';
import LongLogo from "../../assets/longlogo.svg";
import DropDownPicker from 'react-native-dropdown-picker'; // Import the dropdown picker

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    gender: '',
    password: '',
    confirmPassword: '',
  });
  const [alertMessage, setAlertMessage] = useState(null);

  const [open, setOpen] = useState(false);
  const [gender, setGender] = useState(formData.gender);

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      setAlertMessage('Hasła się nie zgadzają.');
      console.log('Hasła się nie zgadzają:', formData.password, formData.confirmPassword);
      return;
    }

    console.log('Wysyłane dane:', formData);

    try {
      const response = await fetch('http://10.0.2.2:5253/api/account/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          gender: gender,
        }), 
      });

      console.log('Odpowiedź serwera:', response);

      if (response.ok) {
        setAlertMessage('Rejestracja zakończona sukcesem. Możesz się teraz zalogować.');
        // navigation.navigate('Login');
      }
      else{
        setAlertMessage('Wprowadź poprawne dane')
      }
    } catch (error) {
      console.log('Błąd podczas rejestracji:', error);
      setAlertMessage('Błąd podczas rejestracji.');
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
          <DropDownPicker
            open={open}
            value={gender}
            items={[
              { label: 'Mężczyzna', value: 'Mężczyzna' },
              { label: 'Kobieta', value: 'Kobieta' },
              { label: 'Inne', value: 'Inne' },
            ]}
            setOpen={setOpen}
            setValue={(value) => {
              setGender(value);
              setFormData({ ...formData, gender: value });
            }}
            placeholder="Płeć"
            containerStyle={{ marginBottom: 16 }}
            style={{
              borderColor: '#D1D5DB',
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 12,
            }}
            dropDownStyle={{
              backgroundColor: 'white',
              borderColor: '#D1D5DB',
            }}
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

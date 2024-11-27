import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import LoginScreen from './components/screens/LoginScreen';
import "./assets/global.css"

export default function App() {
  return (
    <View className="flex-1 items-center justify-center">
      <LoginScreen/>
      <StatusBar/>
    </View>
  );
}


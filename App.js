import { StatusBar } from 'expo-status-bar';
import React from 'react';
import SignUp from './components/signup';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  React.useEffect(() => {
  fetch("/api")
  .then((res) => res.json());
}, []);

  return (
    <View>
      <SignUp/>
    </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

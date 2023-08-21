import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './Screens/LoginScreen';
import HomeScreen from './Screens/HomeScreen';
import ReservationData from './Screens/ReservationVehicleData';
import LogoutButton from './Component/LogoutButton';

const Stack = createStackNavigator()

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login' screenOptions={({ route }) => ({
        headerRight: () => {
          if (route.name === 'Home' || route.name === 'ReservationData') {
            return <LogoutButton />;
          }
          return null;
        },
        headerRightContainerStyle: { marginRight: 16 },
      })}>
        <Stack.Screen component={LoginScreen} name="Login"></Stack.Screen>
        <Stack.Screen component={HomeScreen} name="Home"></Stack.Screen>
        <Stack.Screen component={ReservationData} name="ReservationData"></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

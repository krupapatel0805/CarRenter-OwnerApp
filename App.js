import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from './Screens/SignInScreen';
import HomeScreen from './Screens/HomeScreen';
import BookingDetails from './Screens/BookingDetails';
import LogoutButton from './Component/LogoutButton';

const Stack = createStackNavigator()

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='SignIn' screenOptions={({ route }) => ({
        headerRight: () => {
          if (route.name === 'Home' || route.name === 'BookingDetails') {
            return <LogoutButton />;
          }
          return null;
        },
        headerRightContainerStyle: { marginRight: 16 },
      })}>
        <Stack.Screen component={SignInScreen} name="SignIn"></Stack.Screen>
        <Stack.Screen component={HomeScreen} name="Home"></Stack.Screen>
        <Stack.Screen component={BookingDetails} name="BookingDetails"></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

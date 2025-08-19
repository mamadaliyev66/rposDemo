import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import the screen for this navigator
import LoginScreen from '../components/Auth/LoginScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          // We hide the header for the login screen for a cleaner, full-screen look.
          headerShown: false, 
        }}
      />
      {/* If you add a "Forgot Password" or "Sign Up" screen, you would add them here */}
      {/* <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} /> */}
    </Stack.Navigator>
  );
};

export default AuthNavigator;